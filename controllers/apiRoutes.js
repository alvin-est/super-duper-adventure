const router = require('express').Router();
const authorisedOnly = require('../utils/auth');
const nonAuthorisedOnly = require('../utils/noAuth');
const { User, Post } = require('../models');

/* To-do: Add middleware for authentication in relevant routes */
// Sign up
router.post('/register', nonAuthorisedOnly, async (req, res) => {
    // console.log("Attempting to sign up: ", req.body);
    // res.send("Sign up attempted.");

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
    // console.log("Attempting to sign in: ", req.body);
    // res.send("Sign in attempted.");

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
    // console.log("Attempting to log out: ", req.body);
    // res.send("Log out attempted.");

    try {
        // If the user is logged in, destroy the session
        if (req.session.logged_in) {
            req.session.destroy(() => {
                res.status(204).end();
            });
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
    // console.log("Attempting to write new post: ", req.body);
    // res.send("Article posted.");

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
    console.log("Attempting to comment on post: ", req.body);
    res.send("Comment posted.");
});

module.exports = router;