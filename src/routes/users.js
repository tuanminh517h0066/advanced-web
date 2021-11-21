const express = require('express');
const router = express.Router();
const  passport = require('passport');
const userMiddleware = require('../app/middleware/UserMiddleware');
const memberController = require('../app/controllers/backend/MemberController');


router.get('/index',userMiddleware.checkAuthenticated, function(req, res, next) {
  res.render('home');
});

router.get('/admin/index', userMiddleware.checkAuthenticated, memberController.listMember);
router.get('/admin/add', userMiddleware.checkAuthenticated, memberController.memberForm);
router.post('/admin/member-post', userMiddleware.checkAuthenticated, memberController.post);



// local login
router.get('/login',userMiddleware.checkNotAuthenticated, function(req, res, next) {
    // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
    var messages = req.flash('error')
    // console.log(messages);
    res.render('auth/login',{ 
      messages: messages,
      hasErrors: messages.length > 0,
     })
});

router.post('/login',userMiddleware.checkNotAuthenticated,
  passport.authenticate('local.login', { successRedirect: '/admin/index',
                                  failureRedirect: '/login',
                                  failureFlash: true })
);

// google oauth login
router.get('/auth/google', userMiddleware.checkNotAuthenticated ,
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
)); 

router.get( '/auth/google/callback', userMiddleware.checkNotAuthenticated,
    passport.authenticate( 'google', {
        successRedirect: '/index',
        failureRedirect: '/login'
}));

module.exports = router;