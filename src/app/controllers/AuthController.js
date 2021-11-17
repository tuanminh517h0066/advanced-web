const User = require('../models/User');


class AuthController {

    // get login form
    getLogin(req, res, next) {
        var messages = req.flash('error')
        res.render('auth/login',{ 
            messages: messages,
            hasErrors: messages.length > 0,
        })
    }

}

module.exports = new AuthController;