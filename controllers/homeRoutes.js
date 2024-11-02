const router = require('express').Router();

// Home page
router.get('/', async (req, res) => {
    console.log("Rendering home page.");
    res.render('homepage');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
    console.log("Rendering dashboard.");
    res.render('dashboard');
});

module.exports = router;