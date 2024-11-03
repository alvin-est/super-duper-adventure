const router = require('express').Router();
const authorisedOnly = require('../utils/auth.js');
const nonAuthorisedOnly = require('../utils/noauth.js');
const { User, Post, Comment } = require('../models');
const e = require('express');

// Home page
router.get('/', async (req, res) => {
    try {
        // Fetch all posts - include user and comment information
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['username']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']] // Order by creation date descending
        });

        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('pages/homepage', {
            posts: posts,
            logged_in: req.session.logged_in,
            username: req.session.username
        });
    } catch (err) {
        res.status(500).json(err);
    }

});

// Dashboard
router.get('/dashboard', authorisedOnly, async (req, res) => {
    // console.log("Rendering dashboard.");
    // Fetch posts for the logged-in user
    const postData = await Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        order: [['createdAt', 'DESC']] // Sort by creation date descending
    });

    // Count the reviews for the logged-in user
    const noOfPosts = await Post.count({
        where: {
          user_id: req.session.user_id
        }
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('pages/dashboard' , {
        logged_in: req.session.logged_in,
        username: req.session.username,
        email: req.session.email,
        user_id: req.session.user_id,
        total_posts: noOfPosts,
        posts: posts
    });


});

// Login
router.get('/login', nonAuthorisedOnly, async (req, res) => {
    console.log("Rendering login page.");
    res.render('pages/login');
});

// Register
router.get('/register', nonAuthorisedOnly, async (req, res) => {
    console.log("Rendering register page.");
    res.render('pages/register');
});

module.exports = router;