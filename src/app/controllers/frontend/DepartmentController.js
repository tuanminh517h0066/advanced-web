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
        

        // const notifications = await Notification.find( { department: department_id } ).populate({
        //     path: 'department',
        // }); 
        // res.render('frontend/department-item', {
        //     department_item: mongooseToObject(department_item),
        //     member: mongooseToObject(current_account),
        //     notifications: mutipleMongooseToObject(notifications), 
        // });
        try{ 
            const page = req.query.page || 1;
            const limit = 10;
            const skip = (page -1) *limit;
            let paginationHtml = ''
            const notifications = await Notification.find( { department: department_id }  ).populate({
                path: 'department',
            })
            .sort({updatedAt:-1})
            .limit(limit)
            .skip(skip);

            
            const count = await Notification.countDocuments({ department: department_id });
            const pages = Math.ceil(count / limit);
            if(page == 1)
            {
                paginationHtml+= '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">Previous</a></li>'
            }else
            {
                paginationHtml+= '<li class="page-item "><a class="page-link" href="/member/departments/'+department_id+'/'+'?page=' + (Number(page) - 1) + '" tabindex="-1">Previous</a></li>'
            }
            var i = (Number(page) > 3 ? Number(page) - 2 : 1)
            if(i !== 1) 
            {
                paginationHtml+= '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>'
            }
            for(; i <= (Number(page) + 2) && i <= pages; i++) 
            {
                if(i == page)
                {
                    paginationHtml+= '<li class="page-item active"><a class="page-link" href="/member/departments/'+department_id+'/'+'?page=' + i + '">'+i+'</a></li>'
                }
                else
                {
                    paginationHtml+= '<li class="page-item"><a class="page-link" href="/member/departments/'+department_id+'/'+'?page=' + i + '">'+i+'</a></li>'
                }
                if (i == Number(page) + 2 && i < pages)
                {
                    paginationHtml+= '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>'
                }
            }
            if(page == pages)
            {
                paginationHtml+= '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">Next</a></li>'
            }else
            {
                paginationHtml+= '<li class="page-item "><a class="page-link" href="/member/departments/'+department_id+'/'+'?page=' + (Number(page) + 1) + '" tabindex="-1">Next</a></li>'
            }

            res.render('frontend/department-item', {
                department_item: mongooseToObject(department_item),
                member: mongooseToObject(current_account),
                notifications: mutipleMongooseToObject(notifications),
                pagination: paginationHtml
            });
        }catch(error){
            console.log(error);
        }
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
            errors: req.session.errors
        });

        req.session.errors = null;
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
            errors: req.session.errors
        })
        req.session.errors = null;
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

        const errors = validationResult(req).array();
        
        if (errors != '') {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('back')
           
        } 
        else {
            var deparment_id = req.body.department_id;
            console.log('enter else');  
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