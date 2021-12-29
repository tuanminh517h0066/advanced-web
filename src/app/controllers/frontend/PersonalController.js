
const User = require('../../models/User');
const Department = require('../../models/Department');

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
 
        
        const current_user = await User.findOne({_id: req.user._id });
        if(!current_user.departments) {
            current_user.departments = [];
            current_user.save();
        }

        const update_current_user = await User.findOne({_id: req.user._id });
        update_current_user.username = req.body.username;
        update_current_user.departments = [];
        if(req.file) { 
            update_current_user.avatar = req.file.filename;
          
        }
        department_arr.forEach((element, index) => { 
            update_current_user.departments.push(element);
        })
        update_current_user.save();

        res.redirect('back');
    }
}

module.exports = new PersonalController;