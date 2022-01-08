const Department = require('../../models/Department');
const Post = require('../../models/Post');
const Notification = require('../../models/Notification');
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
        .populate({
            path: 'comments',
            populate: {path: "user"},
            options: { sort: { updatedAt: +1 } },
        })
        .sort('-createdAt').limit(10);

        const member = req.user;

        const notifications = await Notification.find({}).populate('department').sort('-createdAt').limit(10);
        
        // console.log(posts);
        // console.log('%j', posts);

        res.render('frontend/home', {
            departments: mutipleMongooseToObject(departments),
            posts: mutipleMongooseToObject(posts),
            notifications: mutipleMongooseToObject(notifications),
            member: mongooseToObject(member),
            
        });
    }
}

module.exports = new HomeController;