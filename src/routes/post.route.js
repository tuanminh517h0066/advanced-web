const express = require('express');
const router = express.Router();
const userMiddleware = require('../app/middleware/UserMiddleware');
const PostController = require('../app/controllers/frontend/PostController');
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

router.post('/new',userMiddleware.isMember,upload.single('image'), PostController.post );

router.post('/edit',userMiddleware.isMember,PostController.edit);

router.post('/delete',userMiddleware.isMember, PostController.delete)

router.post('/loadmore',userMiddleware.isMember, PostController.loadMore);

router.post('/ajaxRemoveLike',userMiddleware.isMember, PostController.ajaxRemoveLike);

router.post('/ajaxLike',userMiddleware.isMember, PostController.ajaxLike);

router.post('/ajaxAddComment',userMiddleware.isMember,PostController.ajaxAddComment);

router.post('/ajaxDeleteComment',userMiddleware.isMember,PostController.ajaxRemoveComment)


module.exports = router;