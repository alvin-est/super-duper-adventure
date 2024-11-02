const router = require('express').Router();

// Home page
router.get('/', async (req, res) => {
    console.log("Rendering home page.");
    res.render('pages/homepage');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
    console.log("Rendering dashboard.");
    res.render('pages/dashboard');
});

module.exports = router;