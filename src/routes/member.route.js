const express = require('express');
const router = express.Router();
const  passport = require('passport');
const userMiddleware = require('../app/middleware/UserMiddleware');
const HomeController = require('../app/controllers/frontend/HomeController');
const PostController = require('../app/controllers/frontend/PostController');


router.get('/home',userMiddleware.isMember, HomeController.home );

// local login
router.get('/login',userMiddleware.checkAuthenticated, function(req, res, next) {
    // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
    var messages = req.flash('error')
    // console.log(messages);
    res.render('auth/login',{ 
      messages: messages,
      hasErrors: messages.length > 0,
     })
});

router.post('/login',userMiddleware.checkNotAuthenticated,
  passport.authenticate('local.login', { successRedirect: '/member/home',
                                  failureRedirect: '/member/login',
                                  failureFlash: true })
);

// google oauth login
router.get('/auth/google', userMiddleware.checkNotAuthenticated ,
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
)); 

router.get( '/auth/google/callback', userMiddleware.checkNotAuthenticated,
    passport.authenticate( 'google', {
        successRedirect: '/member/home',
        failureRedirect: '/member/login',
        failureFlash: true
}));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/member/login');
});

module.exports = router;