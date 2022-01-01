const express = require('express');
const router = express.Router();
const userMiddleware = require('../app/middleware/UserMiddleware');
const DepartmentController = require('../app/controllers/frontend/DepartmentController');
const fs = require('fs');

const multer  = require('multer')
const { body } = require('express-validator');


// const upload = multer({ dest: './src/public/uploads/' });

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

router.get('/list', userMiddleware.isMember, DepartmentController.list );

router.get('/:department_id',userMiddleware.isMember, DepartmentController.departmentDetail);

router.get('/:department_id/notification/create', userMiddleware.isMember, DepartmentController.createNoti);

router.get('/:department_id/notification/:notification_id/edit', userMiddleware.isMember, DepartmentController.editNoti);

router.get('/:department_id/notification/:notification_id/detail', userMiddleware.isMember, DepartmentController.detailNoti);

router.post('/notification/delete', userMiddleware.isMember,DepartmentController.deleteNoti);

router.post('/notification/post', 
userMiddleware.isMember,
body('noti_title').not().isEmpty().withMessage('must fill title'),
body('description').not().isEmpty().withMessage('must fill this description'),
DepartmentController.postNoti);

router.post('/ajaxUploadImageContent', userMiddleware.isMember, upload.single('image'), DepartmentController.ajaxUploadImageContent);

module.exports = router;