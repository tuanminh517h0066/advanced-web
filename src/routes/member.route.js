const express = require('express');
const router = express.Router();
const User = require('../app/models/User');
const departmentRouter = require('./department.route');

const  passport = require('passport');
const userMiddleware = require('../app/middleware/UserMiddleware');
const HomeController = require('../app/controllers/frontend/HomeController');
const PostController = require('../app/controllers/frontend/PostController');
const PersonalController = require('../app/controllers/frontend/PersonalController');
const multer  = require('multer')
const fs = require('fs');
const { body } = require('express-validator');
const bcrypt = require("bcrypt-nodejs");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir ='./src/public/uploads/'
      fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, error => cb(error, dir))
      }
      return cb(null, dir)
      })
    // cb(null, './src/public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })


router.get('/member/home',userMiddleware.isMember, HomeController.home );

router.get('/member/change-password',userMiddleware.isMember, PersonalController.Password);
router.post('/member/change-password/post', 
userMiddleware.isMember, 
body('currentpw').not().isEmpty().withMessage('must fill current password'),
body('newpw').not().isEmpty().withMessage('must fill new password'), 
body('confirmpw').not().isEmpty().withMessage('must fill confirm password'), 
PersonalController.postPass);

router.get('/member/info-setting', userMiddleware.isMember, PersonalController.infoSetting);
router.post('/member/info-setting/post', userMiddleware.isMember, upload.single('image'), 
body('currentpw').not().isEmpty().withMessage('must fill current password'),
body('newpw').not().isEmpty().withMessage('must fill new password'),
PersonalController.postSetting);

router.get('/member/profile/:member_id', userMiddleware.isMember,PersonalController.ProfileIndex);

router.use('/member/departments', departmentRouter);



// local login
router.get('/login',userMiddleware.checkNotAuthenticated, function(req, res, next) {
    // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
    var messages = req.flash('error')
    // console.log(messages);
    res.render('auth/login',{ 
      messages: messages,
      hasErrors: messages.length > 0,
      layout: 'login_layout'
     })
});

router.post('/member/login',userMiddleware.checkNotAuthenticated,
  passport.authenticate('local.login', { successRedirect: '/member/home',
                                  failureRedirect: '/login',
                                  failureFlash: true })
);

// google oauth login
router.get('/member/auth/google', userMiddleware.checkNotAuthenticated ,
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
)); 

router.get( '/member/auth/google/callback', userMiddleware.checkNotAuthenticated,
    passport.authenticate( 'google', {
        successRedirect: '/member/home',
        failureRedirect: '/login',
        failureFlash: true
}));

router.get('/member/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

router.get('/',userMiddleware.isMember, HomeController.home );

module.exports = router;