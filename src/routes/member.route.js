const express = require('express');
const router = express.Router();
const departmentRouter = require('./department.route');

const  passport = require('passport');
const userMiddleware = require('../app/middleware/UserMiddleware');
const HomeController = require('../app/controllers/frontend/HomeController');
const PostController = require('../app/controllers/frontend/PostController');
const PersonalController = require('../app/controllers/frontend/PersonalController');
const multer  = require('multer')
const fs = require('fs');


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


router.get('/home',userMiddleware.isMember, HomeController.home );

router.get('/change-password',userMiddleware.isMember, PersonalController.Password);
router.post('/change-password/post', userMiddleware.isMember, PersonalController.postPass);

router.get('/info-setting', userMiddleware.isMember, PersonalController.infoSetting);
router.post('/info-setting/post', userMiddleware.isMember, upload.single('image'), PersonalController.postSetting)

router.use('/departments', departmentRouter);



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