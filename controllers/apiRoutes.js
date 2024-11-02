const router = require('express').Router();

/* To-do: Add middleware for authentication in relevant routes */
// Sign up
router.post('/register', async (req, res) => {
    console.log("Attempting to sign up: ", req.body);
    res.send("Sign up attempted.");
});

// Sign in
router.post('/login', async (req, res) => {
    console.log("Attempting to sign in: ", req.body);
    res.send("Sign in attempted.");
});

// Logout
router.post('/logout', async (req, res) => {
    console.log("Attempting to log out: ", req.body);
    res.send("Log out attempted.");
});

// Write new article
router.post('/post', async (req, res) => {
    console.log("Attempting to write new post: ", req.body);
    res.send("Article posted.");
});

// Comment on post
router.post('/comment', async (req, res) => {
    console.log("Attempting to comment on post: ", req.body);
    res.send("Comment posted.");
});

module.exports = router;