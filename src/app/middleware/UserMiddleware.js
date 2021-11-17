

class UserMiddleware {
    checkAuthenticated (req, res, next) {
        
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }

    checkNotAuthenticated (req, res, next) {
        if (req.isAuthenticated())
            // console.log(1);
            res.redirect('/admin/index');
        return next();
    }
}

module.exports = new UserMiddleware;