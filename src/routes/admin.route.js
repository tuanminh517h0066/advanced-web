const express = require('express');
const router = express.Router();
const  passport = require('passport');


const userMiddleware = require('../app/middleware/UserMiddleware');
const memberController = require('../app/controllers/backend/MemberController');
const { body } = require('express-validator');


router.get('/index', userMiddleware.isAdmin, memberController.listMember);
router.get('/add1', userMiddleware.isAdmin, memberController.addMember);

router.post('/member-post', 
userMiddleware.isAdmin,
body('email').not().isEmpty(),
body('username').not().isEmpty(), 
memberController.post);

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
                                  failureRedirect: '/admin/login',
                                  failureFlash: true })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin/login');
});





module.exports = router;