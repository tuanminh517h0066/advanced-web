const Department = require('../../models/Department');
const Post = require('../../models/Post');
const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');


class HomeController {
    
    async home(req, res, next) {
        const departments = await Department.find({});
        const posts = await Post.find({}).populate('department user')
        .populate({
            path: 'likes',
            populate: {path: "user"}
        })
        .sort('-updatedAt').limit(5);
        const member = req.user;
        
        // console.log(posts);
        // console.log('%j', posts);

        res.render('frontend/home', {
            departments: mutipleMongooseToObject(departments),
            posts: mutipleMongooseToObject(posts),
            member: mongooseToObject(member),
            
        });
    }
}

module.exports = new HomeController;