const Department = require('../../models/Department');
const Member = require('../../models/Member');
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const nodeMailer = require('nodemailer')


const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class MemberController {
    async listTeacher(req, res, next) {

        // const members = await User.find({});
        const admin_name = req.user;
        const members = await User.find({role: 1}).populate({ path: 'departments' }).sort('-createdAt')
        

        res.render('backend/Admin', {
            members: mutipleMongooseToObject(members),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async listStudent(req, res, next) {

        // const members = await User.find({});
        const admin_name = req.user;
        const members = await User.find({role: 0}).sort('-createdAt')
        

        res.render('backend/member/student-list', {
            members: mutipleMongooseToObject(members),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    // async memberForm(req, res, next) {
        
    //     const departments = await Department.find({});
        
    //     // console.log(departments);

    //     res.render('backend/member/add', {
    //         departments: mutipleMongooseToObject(departments),
    //         errors: req.session.errors,
    //     });
        
    // }


    async addMember(req, res, next) {
        const admin_name = req.user;
        const departments = await Department.find({});
        res.render('backend/member/add1',{
            admin: mongooseToObject(admin_name),
            departments: mutipleMongooseToObject(departments),
            layout: 'backend',
            errors: req.session.errors,
        });    

        req.session.errors = null;
    }

    async deleteMember(req, res, next) {

        var member_id = req.body.member_id;
        
        User.findOneAndDelete({_id: member_id }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted User : ", docs);
            }
        });

        res.redirect('back');
    }

    async editDepartmentMember(req, res, next) {
        var member_id = req.params.id;
        var member = await User.findOne({'_id': member_id })
        var departments = await Department.find({});
        var admin_name = req.user;

        res.render('backend/member/edit-department',{
            admin: mongooseToObject(admin_name),
            departments: mutipleMongooseToObject(departments),
            member: mongooseToObject(member),
            layout: 'backend',
            errors: req.session.errors,
        });

        req.session.errors = null;
    }

    async postDepartmentMember(req, res, next) {
        const department_arr = req.body.departments;
        const departments = await Department.find({});
        const member_id = req.body.member_id;

        console.log(member_id);
        console.log(department_arr);

        const errors = validationResult(req).array();

        if (errors != '') {
            req.session.errors = errors;
            req.session.success = false;
            console.log(1);
            
            res.redirect('back')
        // return res.status(400).json({ errors: errors.array() });
        } else {
            
            const current_user = await User.findOne({_id: member_id });
            if(!current_user.departments) {
                current_user.departments = [];
                current_user.save();
            }
        
            departments.forEach( async (element, index) =>  { 
                
                const department = await Department.findById(element._id);
                department.users.pull(member_id);
                await department.save();
            })

            const update_current_user = await User.findOne({_id: member_id });

            update_current_user.departments = [];

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

        
    }

    async post(req, res, next) {

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req).array();
        if (errors != '') {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('back')
        // return res.status(400).json({ errors: errors.array() });
        } else {
            console.log(req.body.departments);
            const department_arr = req.body.departments;
    
            const member = new User();
    
            member.email = req.body.email;
            member.username = req.body.username;
            member.password = member.encryptPassword('123456');
    
            department_arr.forEach((element, index) => { 
                member.departments.push(element);
            })
            
    
            member.role = 1;
    
            member.save(async function(err,user) {
                if (err) console.log(err);
                console.log(user._id);
                // Department.findByIdAndUpdate(req.body.department_id, { $push: { members: user._id } })
    
                // const department = await Department.findById(req.body.department_id);
    
                // department.users = user._id;
    
                // await department.save();
                department_arr.forEach( async (element, index) =>  { 
                    const department = await Department.findById(element)
                    department.users.push(user._id);
                    await department.save();
                    
                })
            });
    
            //sendmail
            const transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // n???u c??c b???n d??ng port 465 (smtps) th?? ????? true, c??n l???i h??y ????? false cho t???t c??? c??c port kh??c
                auth: {
                    user: 'jobportal.tdtu@gmail.com',
                    pass: '517h0066'
                }
                
            })
            const options = {
                from: 'jobportal.tdtu@gmail.com', // ?????a ch??? admin email b???n d??ng ????? g???i
                to: req.body.email, // ?????a ch??? g???i ?????n
                cc: 'ltuanminh049@gmail.com',
                subject: 'New account for teacher', // Ti??u ????? c???a mail
                html: '<p>You have got a new message</p><ul><li>Username: ' + req.body.username + '</li><li>Email: ' + req.body.email + '</li><li>Password: 123456</li><li><a href="http://localhost:3000/login"> Click here to login </a></li></ul>' // Ph???n n???i dung mail m??nh s??? d??ng html thay v?? thu???n v??n b???n th??ng th?????ng.
              }
            
            transporter.sendMail(options)
        }
        

        return res.redirect('/admin/index');
        
    }
}

module.exports = new MemberController;