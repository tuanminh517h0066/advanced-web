const Department = require('../../models/Department');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class DepartmentController {
    
    async list(req, res, next) {
        const departments = await Department.find({});

        res.render('frontend/create-notification',{
            departments: mutipleMongooseToObject(departments)
        });
    }

    async departmentDetail(req, res, next) {

        const current_account = req.user;

        const department_item = await Department.findOne({_id: req.params.department_id})
        .populate({
            path: 'users',
        });

        res.render('frontend/department-item', {
            department_item: mongooseToObject(department_item),
            member: mongooseToObject(current_account),
        });
    }

    async createNoti(req, res, next) {
        
        const department_item = await Department.findOne({_id: req.params.department_id})
        const current_account = req.user;

        res.render('frontend/create-notification', {
            department_item: mongooseToObject(department_item),
            member: mongooseToObject(current_account),
        });
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