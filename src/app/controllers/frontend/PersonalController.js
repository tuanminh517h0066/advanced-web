
const User = require('../../models/User');
const Department = require('../../models/Department');

const Post = require('../../models/Post');
const Notification = require('../../models/Notification');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

const bcrypt = require("bcrypt-nodejs");

const { body, validationResult } = require('express-validator');

class PersonalController {
    
    async Password(req, res, next) {
        var current_member = req.user;
        res.render('frontend/change-password',{
            errors: req.session.errors,
            success: req.session.success,
            member: mongooseToObject(current_member)
        });
        req.session.errors = null;
        req.session.success = null;
    }

    async postPass(req, res, next) {
        const errors = validationResult(req).array();
        if (errors != '') {
            // console.log(errors);
            req.session.errors = errors;
            
            res.redirect('back')
        // return res.status(400).json({ errors: errors.array() });
        } else {
            var password_db  = req.user.password;
            var current_pass = req.body.currentpw;
            var new_pass     = req.body.newpw;
            var confirmpass  = req.body.confirmpw;
            try {
                if(bcrypt.compareSync(current_pass, password_db))
                {
                    
                    if(new_pass == confirmpass) {
                        var current_user = await User.findOne({_id: req.user._id });
                        current_user.password = current_user.encryptPassword(confirmpass);
                        current_user.save();
                        
                        req.session.success = [{ msg: 'update password successfully' }]
                        res.redirect('back');
                    }else {
                        req.session.errors = [{ msg: 'must be same password' }]
                        res.redirect('back');
                    }
                } else
                {
                    req.session.errors = [{ msg: 'wrong password' }]
                    res.redirect('back');
                }
            } catch (err) {
                next(err);
            }
        }
        

        // res.render('back');
    }

    async infoSetting(req, res, next) {

        const departments = await Department.find({});
        // const current_account = req.user;
        const facilites = await Department.find({facility_status: 1})

        const current_account = await User.findById(req.user._id);
        // console.log(current_account);

        res.render('frontend/info-setting',{
            success: req.session.success,
            member: mongooseToObject(current_account),
            departments: mutipleMongooseToObject(departments),
            facilites: mutipleMongooseToObject(facilites),
        });

        req.session.success = null;
    }

    async postSetting(req, res, next) {
        const department_arr = req.body.departments;
        const username = req.body.username;
        const departments = await Department.find({});
        // console.log(departments)
        console.log(department_arr);
 
        const update_current_user = await User.findOne({_id: req.user._id });
        update_current_user.username = req.body.username;
        update_current_user.departments = [];
        if(req.file) { 
            update_current_user.avatar = req.file.filename;
          
        }
        if(req.body.class) {
            update_current_user.class = req.body.class;

        }

        if(req.body.facility) {
            update_current_user.facility = req.body.facility;
        }

        


        update_current_user.save(async function(err,user) {
            if (err) console.log(err);
            
            
        });

        req.session.success = [{ msg: 'update profile successfully' }]

        res.redirect('back');
    }

    async ProfileIndex(req, res, next) {
        var member_id = req.params.member_id;
        const departments = await Department.find({});
        const member = await User.findOne({_id: member_id})
        const current_member = req.user;
        const notifications = await Notification.find({}).populate('department').sort('-createdAt').limit(10);

        const posts = await Post.find({user: member_id}).populate('department user')
        .populate({
            path: 'likes',
            populate: {path: "user"}
        })
        .populate({
            path: 'comments',
            populate: {path: "user"},
            options: { sort: { createdAt: -1 } },
        })
        .sort('-updatedAt').limit(5);
        
        res.render('frontend/profile', {
            departments: mutipleMongooseToObject(departments),
            posts: mutipleMongooseToObject(posts),
            notifications: mutipleMongooseToObject(notifications),
            member: mongooseToObject(member),
            current_member: mongooseToObject(current_member)
            
        });
    }
}

module.exports = new PersonalController;