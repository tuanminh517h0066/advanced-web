const Post = require('../../models/Post');
const Like = require('../../models/Like');

class PostController {
    
    async post(req, res, next) {

       
        var current_account = req.user._id
        var id = 0
        if(req.body.post_id) {
            id = req.body.post_id
            
        }
        
        Post.findOne({ '_id': id }, async function(err, post) {
            if (err) {
                console.log(err)
            }
            if (post) {
                console.log('update');
                
                post.title   = req.body.title;
                post.content = req.body.content;
                post.user  = req.user._id;
                if(req.file) {
                    console.log(req.file.filename);
                    post.image = req.file.filename;
                }
                if(req.body.video) {
                    post.video = req.body.video;
                }
                
                post.department = req.body.department_id;
                post.status = 1;
                
                post.save( async function(err,post){
                    if (err){
                        console.log(err);
                    }
                    else{
                        Post.populate(post, {path:"department user"}, function(err, post) { 
                            // console.log(post);
                            // res.json({success: true, type: 'new', post});
                            res.json({success: true, type: 'update',current_account: current_account, post});
                        });
                        
                    }
                })
                // res.json({success: true, type: 'update', post});
            }
            
            if (!post) {
                console.log('new');
                const newpost   = new Post();
                newpost.title   = req.body.title;
                newpost.content = req.body.content;
                newpost.user  = req.user._id;
                if(req.file) {
                    console.log(req.file.filename);
                    newpost.image = req.file.filename;
                }
                if(req.body.video) {
                    newpost.video = req.body.video;
                }
                
                newpost.department = req.body.department_id;
                newpost.status = 1;

                newpost.save( async function(err,post){
                    if (err){
                        console.log(err);
                    }
                    else{
                        Post.populate(post, {path:"department user"}, function(err, post) { 
                            res.json({success: true, type: 'new',current_account: current_account, post});
                        });
                        
                    }
                })
               
            } 
        });
    }

    async edit(req, res, next) {
        var post_id = req.body.id
        var post_detail = await Post.findById(post_id).populate('department user').exec();

        // console.log(post_detail);
        res.json(post_detail);
    }

    async delete(req, res, next) {
        var post_id = req.body.id;
        Post.findOneAndDelete({_id: post_id }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                res.json(docs)
            }
        });
    }

    async loadMore(req, res, next) {

        var startForm = parseInt(req.body.start);
        var current_account = req.user._id
        // console.log(current_account);
        
        const posts = await Post.find({}).populate('department user').skip(startForm).sort('-updatedAt').limit(2).exec();
        
        // console.log(posts);

        res.json({current_account: current_account, posts});
    }

    async ajaxLike(req,res,next) {

         var memberId = req.user._id;
         var postId = req.body.post_id;
        

         const postLike = new Like();
         postLike.user  = memberId;
         postLike.post  = postId;
         postLike.save( async function(err,postLike){
            if (err) {
                console.log(err);
            }
            else{
                const post = await Post.findById(postId);
                post.likes.push(postLike._id);
                await post.save();
                
            }

            res.json({id: postLike._id});
        })

    }

    async ajaxRemoveLike(req, res, next) {

        var like_id = req.body.id;
        
        Like.findOneAndDelete({_id: like_id }, async function (err, like) {
            if (err){
                console.log(err)
            }
            else{
                const post = await Post.findById(like.post);
                post.likes.pull(like_id)
                await post.save();
            }

            res.json({success: true})

        });

    }
}

module.exports = new PostController;