/* 
    Access Control Middleware
    - Only allows access to routes if the user IS logged in (eg. dashboard)
*/

// Redirect user if not logged in
const auth = (req, res, next) => {
    if (!req.session.logged_in) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = auth;