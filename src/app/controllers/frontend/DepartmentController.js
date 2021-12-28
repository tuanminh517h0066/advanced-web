const Department = require('../../models/Department');
const Notification = require('../../models/Notification');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

const { body, validationResult } = require('express-validator');

class DepartmentController {
    
    async list(req, res, next) {

        const departments = await Department.find({});

        res.render('frontend/department-list',{
            departments: mutipleMongooseToObject(departments)
        });
    }

    async departmentDetail(req, res, next) {

        const current_account = req.user;
        const department_id = req.params.department_id;

        const department_item = await Department.findOne({_id: req.params.department_id})
        .populate({
            path: 'users',
        });

        const notifications = await Notification.find( { department: department_id } ).populate({
            path: 'department',
        });


        res.render('frontend/department-item', {
            department_item: mongooseToObject(department_item),
            member: mongooseToObject(current_account),
            notifications: mutipleMongooseToObject(notifications),
        });
    }

    async createNoti(req, res, next) {
        
        const department_item = await Department.findOne({_id: req.params.department_id})
        .populate({
            path: 'users',
        });
        const current_account = req.user;

        res.render('frontend/create-notification', {
            department_item: mongooseToObject(department_item),
            member: mongooseToObject(current_account),
        });
        
    }

    async editNoti(req, res, next) {
        var noti_id = req.params.notification_id;
        var noti_item = await Notification.findOne({_id: noti_id})
        const department_item = await Department.findOne({_id: req.params.department_id})
        .populate({
            path: 'users',
        });
        const current_account = req.user;

       
        res.render('frontend/create-notification',{
            department_item: mongooseToObject(department_item),
            noti_item: mongooseToObject(noti_item),
            member: mongooseToObject(current_account),
        })
    }

    async deleteNoti(req, res, next) {

        var notification_id = req.body.notification_id;
        Notification.findOneAndDelete({_id: notification_id }, async function (err, noti) {
            if (err){
                console.log(err)
            }
            else{
                const department = await Department.findById(noti.department);
                department.notifications.pull(notification_id)
                await department.save();
                
            }
        });

        res.redirect('back');
    }

    async detailNoti(req, res, next) {

        var noti_id = req.params.notification_id;
        var noti_item = await Notification.findOne({_id: noti_id})

        const department_item = await Department.findOne({_id: req.params.department_id})
        .populate({
            path: 'users',
        });
        const current_account = req.user;

        res.render('frontend/detail-notification',{
            department_item: mongooseToObject(department_item),
            noti_item: mongooseToObject(noti_item),
            member: mongooseToObject(current_account),
        })
    }

    async postNoti(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            res.redirect('back',{
                errors: mutipleMongooseToObject(errors),
            })
        return res.status(400).json({ errors: errors.array() });
        }

        var deparment_id = req.body.department_id;

        Notification.findOne({ '_id': req.body.notification_id }, async function(err, notification) {
            if (err) {
                console.log(err)
            }
            if (notification) {
                console.log('update notification');
                
                notification.title = req.body.noti_title;
                notification.department = deparment_id;
                notification.description = req.body.description;
                notification.status = req.body.important_status;
                
                notification.save();
                // res.json({success: true, type: 'update', post});
            }
            if (!notification) {
                console.log('new notification');
                const newNoti = new Notification();
                newNoti.title = req.body.noti_title;
                newNoti.department = deparment_id;
                newNoti.description = req.body.description;
                newNoti.status = req.body.important_status;

                newNoti.save( async function(err,newNoti){
                    if (err) {
                        console.log(err);
                    }
                    else{
                        const department = await Department.findById(deparment_id);
                        department.notifications.push(newNoti._id);
                        await department.save();

                    }
                })
            }
        })

        res.redirect(`/member/departments/${deparment_id}`);
    }


    async ajaxUploadImageContent(req, res, next) {
        var image='';
        if(req.file) { 
            // return response()->json(['success'=> 1, 'url' => '/uploads/clubs/img_content/' . $image]);
            image = req.file.filename;
        }
        res.json({success: 1, url: '/uploads/'+ image});
    }

}

module.exports = new DepartmentController;