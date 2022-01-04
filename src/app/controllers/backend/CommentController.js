
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class CommentController {

    async commentList(req, res, next) {

        const commentList = await Comment.find({}).populate('user').sort('-createdAt');
        const admin_name = req.user;

        res.render('backend/comment/list', {
            comments: mutipleMongooseToObject(commentList),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async deleteComment(req, res, next) {
        var comment_id = req.body.comment_id;
        
        Comment.findOneAndDelete({_id: comment_id }, async function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted User : ", docs);
                const post = await Post.findById(docs.post);
                post.comments.pull(comment_id)
                await post.save();
            }
        });
        res.redirect('back');
    }
}

module.exports = new CommentController;