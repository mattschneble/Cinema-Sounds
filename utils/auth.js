// create a middleware to check if the user is authenticated
const auth = (req, res, next) => {
    // if the user is not authenticated, redirect the request to the login route
    if (!req.session.logged_in) {
        res.redirect('/login');
    } else {
        res.locals.logged_in = true;
        // otherwise, proceed as planned
        next();
    }
};

// export the middleware
module.exports = auth;