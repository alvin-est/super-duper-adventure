const router = require('express').Router();
const authorisedOnly = require('../utils/auth');
const nonAuthorisedOnly = require('../utils/noAuth');
const { User, Post } = require('../models');
const e = require('express');

// Home page
router.get('/', async (req, res) => {
    // console.log("Rendering home page.");

    try {
        // Fetch all posts and include user information
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
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

    // Count the reviews for the logged-in user
    const noOfPosts = await Post.count({
        where: {
          user_id: req.session.user_id
        }
    });

    res.render('pages/dashboard' , {
        logged_in: req.session.logged_in,
        username: req.session.username,
        email: req.session.email,
        user_id: req.session.user_id,
        total_posts: noOfPosts
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