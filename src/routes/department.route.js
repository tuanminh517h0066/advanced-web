const express = require('express');
const router = express.Router();
const userMiddleware = require('../app/middleware/UserMiddleware');
const DepartmentController = require('../app/controllers/frontend/DepartmentController');

const multer  = require('multer')


// const upload = multer({ dest: './src/public/uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

router.get('/list', userMiddleware.isMember, DepartmentController.list );

router.get('/:department_id',userMiddleware.isMember, DepartmentController.departmentDetail);

router.get('/:department_id/notification/create', userMiddleware.isMember, DepartmentController.createNoti);

router.post('/ajaxUploadImageContent', userMiddleware.isMember, upload.single('image'), DepartmentController.ajaxUploadImageContent);

module.exports = router;