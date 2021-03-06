const express = require('express');
const router = express.Router();
const  passport = require('passport');
const User = require('../app/models/User');


const userMiddleware = require('../app/middleware/UserMiddleware');
const memberController = require('../app/controllers/backend/MemberController');
const PostController = require('../app/controllers/backend/PostController');
const DepartmentController = require('../app/controllers/backend/DepartmentController');
const CommentController = require('../app/controllers/backend/CommentController');
const NotificationController = require('../app/controllers/backend/NotificationController');
const { body } = require('express-validator');


router.get('/index', userMiddleware.isAdmin, memberController.listTeacher);

router.get('/student/list', userMiddleware.isAdmin, memberController.listStudent);
router.get('/add1', userMiddleware.isAdmin, memberController.addMember);

router.get('/post/list',userMiddleware.isAdmin, PostController.postList);
router.post('/post/delete', userMiddleware.isAdmin, PostController.deletePost);


router.get('/comment/list', userMiddleware.isAdmin, CommentController.commentList);
router.post('/comment/delete', userMiddleware.isAdmin, CommentController.deleteComment);

router.get('/notification/list', userMiddleware.isAdmin, NotificationController.notificationList);
router.post('/notification/delete', userMiddleware.isAdmin, NotificationController.deleteNotification);

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
  return User.findOne({'email': req.body.email}).then(user => {
      if (user) {
          return Promise.reject('Email already in use');
      }
  });
}),
body('username').not().isEmpty().withMessage('must fill username'), 
body('departments').not().isEmpty().withMessage('must fill departments'),
memberController.post);


router.get('/member/edit/department/:id', userMiddleware.isAdmin, memberController.editDepartmentMember);
router.post('/member/edit/department/post',
userMiddleware.isAdmin, 
body('departments').not().isEmpty().withMessage('must fill departments'),
memberController.postDepartmentMember);

router.post('/member/delete',userMiddleware.isAdmin, memberController.deleteMember);

// router.get('/login',userMiddleware.checkNotAuthenticated, function(req, res, next) {
//     // Hi???n th??? trang v?? truy???n l???i nh???ng tin nh???n t??? ph??a server n???u c??
//     var messages = req.flash('error')
//     // console.log(messages);
//     res.render('auth/login',{ 
//       messages: messages,
//       hasErrors: messages.length > 0,
//      })
// });

// router.post('/login',userMiddleware.checkNotAuthenticated,
//   passport.authenticate('local.login', { successRedirect: '/admin/index',
//                                   failureRedirect: '/admin/login',
//                                   failureFlash: true })
// );

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});





module.exports = router;