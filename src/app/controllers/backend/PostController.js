
const Post = require('../../models/Post');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class PostController {

    async postList(req, res, next) {

        const postList = await Post.find({}).populate('user').sort('-createdAt');
        const admin_name = req.user;

        res.render('backend/post/list', {
            posts: mutipleMongooseToObject(postList),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async deletePost(req, res, next) {
        var post_id = req.body.post_id;
        
        Post.findOneAndDelete({_id: post_id }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted User : ", docs);
            }
        });
        res.redirect('back');
    }

}

module.exports = new PostController;