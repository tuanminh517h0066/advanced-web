const express = require('express');
const router = express.Router();
const  passport = require('passport');
const User = require('../app/models/User');


const userMiddleware = require('../app/middleware/UserMiddleware');
const memberController = require('../app/controllers/backend/MemberController');
const PostController = require('../app/controllers/backend/PostController');
const DepartmentController = require('../app/controllers/backend/DepartmentController');
const { body } = require('express-validator');


router.get('/index', userMiddleware.isAdmin, memberController.listTeacher);

router.get('/student/list', userMiddleware.isAdmin, memberController.listStudent);
router.get('/add1', userMiddleware.isAdmin, memberController.addMember);

router.get('/post/list',userMiddleware.isAdmin, PostController.postList);
router.post('/post/delete', userMiddleware.isAdmin, PostController.deletePost);

router.get('/department/list', userMiddleware.isAdmin, DepartmentController.departmentList);
router.get('/department/add', userMiddleware.isAdmin, DepartmentController.addDepartment);
router.get('/department/edit/:id', userMiddleware.isAdmin, DepartmentController.editDepartment);
router.post('/department/delete', userMiddleware.isAdmin, DepartmentController.deleteDepartment);
router.post('/department/post',
userMiddleware.isAdmin, 
body('name').not().isEmpty().withMessage('must fill name'),
DepartmentController.postDepartment);

router.post('/member-post', 
userMiddleware.isAdmin,
body('email').not().isEmpty().withMessage('must fill email').custom((value, {req, loc, path}) => {
  return User.findOne({
      where: {
          email: req.body.email,
      }
  }).then(user => {
      if (user) {
          return Promise.reject('Email already in use');
      }
  });
}),
body('username').not().isEmpty().withMessage('must fill username'), 
body('departments').not().isEmpty().withMessage('must fill departments'),
memberController.post);

router.post('/member/delete',userMiddleware.isAdmin, memberController.deleteMember);

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