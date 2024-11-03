/* 
    Access Control Middleware
    - Only allows access to routes if the user is NOT logged in (eg. register and login pages)
*/
// Redirect user if logged in
const noAuth = (req, res, next) => {
    if (req.session.logged_in) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = noAuth;