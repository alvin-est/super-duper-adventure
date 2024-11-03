const router = require('express').Router();
const authorisedOnly = require('../utils/auth');
const nonAuthorisedOnly = require('../utils/noauth');
const { User, Post, Comment } = require('../models');

// Sign up
router.post('/register', nonAuthorisedOnly, async (req, res) => {
    try {
        // Extract user data from the request body
        const { username, email, password } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide a username, email, and password." });
        }

        // Check if the password meets the length requirement (8 characters)
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Create a new user
        const newUser = await User.create({ username, email, password });

        // If user creation is successful, log the user in
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.username;
            req.session.email = newUser.email;
            req.session.logged_in = true;

            res.status(201).json({ 
                user: newUser, 
                message: 'Registration successful! You are now logged in.' 
              });
        });    
    }
    catch (err) {
        console.error("Registration error:", err); // Log the error for debugging
        // If there's a unique constraint error (email already exists), send a specific message
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'The email address is already in use' });
        }
        // For any other error, send a general error message
        res.status(500).json({ message: 'An error occurred while registering the user', error: err.message });
    }
});

// Sign in
router.post('/login', nonAuthorisedOnly, async (req, res) => {
    try {
        // Extract user data from the request body
        const { email, password } = req.body;

        // Check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide an email and password." });
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        // If the user is not found, send a specific message
        if (!user) {
            return res.status(400).json({ message: 'No user with that email address' });
        }

        // Check if the password is correct
        const validPassword = await user.checkPassword(password);

        // If the password is incorrect, send a specific message
        if (!validPassword) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // If the password is correct, log the user in
        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.logged_in = true;

            res.json({ user: user, message: 'Login successful!' });
        });
    }
    catch (err) {
        res.status(500).json({ message: 'An error occurred while logging in the user', error: err.message });
    }
});

// Logout
router.post('/logout', authorisedOnly, async (req, res) => {
    try {
        // If the user is logged in, destroy the session
        if (req.session.logged_in) {
            req.session.destroy(() => {
                res.status(204).end();
            });
            res.redirect('/login');
        }
        // If the user is not logged in, send a specific message
        else {
            res.status(404).json({ message: 'No user to log out!' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'An error occurred while logging out the user', error: err.message });
    }
});

// Write new article
router.post('/post', authorisedOnly, async (req, res) => {
    try {
        // Extract post data from the request body
        const { title, content } = req.body;
        
        // Create a new post
        const newPost = await Post.create({
            title,
            content,
            user_id: req.session.user_id // Get the user_id from the session
        });
        console.log("New post created: ", newPost.toJSON());
        res.status(201).json({ message: 'Post created successfully', post: newPost.toJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
});

// Comment on post
router.post('/comment', authorisedOnly, async (req, res) => {
    // console.log("Attempting to comment on post: ", req.body);
    // res.send("Comment posted.");

    try {
        // Extract comment data from the request body
        const { content, post_id } = req.body;
        if (!content || !post_id) {
            return res.status(400).json({ message: 'Content and post ID are required' });
        }

        const newComment = await Comment.create({
            content,
            user_id: req.session.user_id, // Assuming this is how you're tracking the logged-in user
            post_id,
        });

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create comment', error: err.message });
    }
});

// Delete a post
router.delete('/removePost/:id', authorisedOnly, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId); // Use Post model directly

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the logged in user is the author
        if (req.session.user_id !== post.user_id) {
            return res.status(403).json({ message: 'You do not have permission to delete this post' });
        }

        // Delete the post
        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete post', error: err.message });
    }
});

// Delete a comment
router.delete('/removeComment/:id', authorisedOnly, async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user_id !== req.session.user_id) {
            return res.status(403).json({ message: 'You do not have permission to delete this comment' });
        }

        await Comment.destroy({ where: { id: commentId } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete comment', error: err.message });
    }
});

// Put route to edit a post
router.put('/editPost/:id', authorisedOnly, async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        // Check if title or content is provided for update
        if (!title && !content) {
            return res.status(400).json({ message: 'Please provide at least one field to update: title or content' });
        }

        // Fetch the post to check ownership or permissions
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.user_id !== req.session.user_id) {
            return res.status(403).json({ message: 'You do not have permission to edit this post' });
        }

        // Update the post
        await post.update({ 
            title: title || post.title, 
            content: content || post.content 
        });

        res.status(200).json({ message: 'Post updated successfully', post: post.toJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update post', error: err.message });
    }
});


module.exports = router;