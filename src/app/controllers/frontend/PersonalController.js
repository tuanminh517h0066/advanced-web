
const User = require('../../models/User');
const Department = require('../../models/Department');

const Post = require('../../models/Post');
const Notification = require('../../models/Notification');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

const bcrypt = require("bcrypt-nodejs");

class PersonalController {
    
    async Password(req, res, next) {
        
        res.render('frontend/change-password');
    }

    async postPass(req, res, next) {
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
                    

                    res.redirect('back');
                }
            } else
            {
                console.log('wrong password');
            }
        } catch (err) {
            next(err);
        }

        // res.render('back');
    }

    async infoSetting(req, res, next) {

        const departments = await Department.find({});
        // const current_account = req.user;

        const current_account = await User.findById(req.user._id);
        // console.log(current_account);

        res.render('frontend/info-setting',{
            member: mongooseToObject(current_account),
            departments: mutipleMongooseToObject(departments),
        });
    }

    async postSetting(req, res, next) {
        const department_arr = req.body.departments;
        const username = req.body.username;
        const departments = await Department.find({});
        // console.log(departments)
 
        
        const current_user = await User.findOne({_id: req.user._id });
        if(!current_user.departments) {
            current_user.departments = [];
            current_user.save();
        }

        departments.forEach( async (element, index) =>  { 
            const department = await Department.findOne(element._id);

            department.users.pull(req.user._id);
            await department.save();
        })

        
        const update_current_user = await User.findOne({_id: req.user._id });
        update_current_user.username = req.body.username;
        update_current_user.departments = [];
        if(req.file) { 
            update_current_user.avatar = req.file.filename;
          
        }
        department_arr.forEach((element, index) => { 
            update_current_user.departments.push(element);
        })
        update_current_user.save(async function(err,user) {
            if (err) console.log(err);

            department_arr.forEach( async (element, index) =>  { 
                const department = await Department.findById(element)
                department.users.push(user._id);
                await department.save();
                
            })
        });

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