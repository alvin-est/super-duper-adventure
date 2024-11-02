const router = require('express').Router();
const authorisedOnly = require('../utils/auth');

// Home page
router.get('/', async (req, res) => {
    console.log("Rendering home page.");
    res.render('pages/homepage', {
        logged_in: req.session.logged_in,
        username: req.session.username
    });
});

// Dashboard
router.get('/dashboard', authorisedOnly, async (req, res) => {
    console.log("Rendering dashboard.");
    res.render('pages/dashboard');
});

// Login
router.get('/login', async (req, res) => {
    console.log("Rendering login page.");
    res.render('pages/login');
});

// Register
router.get('/register', async (req, res) => {
    console.log("Rendering register page.");
    res.render('pages/register');
});

module.exports = router;