const Department = require('../../models/Department');

const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');
const { body, validationResult } = require('express-validator');

class DepartmentController {
    async departmentList(req, res, next) {
        const departments = await Department.find({});
        const admin_name = req.user;

        res.render('backend/department/list', {
            departments: mutipleMongooseToObject(departments),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async addDepartment(req, res, next) {
        const admin_name = req.user;

        res.render('backend/department/add', {
            admin: mongooseToObject(admin_name),
            layout: 'backend',
            errors: req.session.errors
        });

        req.session.errors = null;
    }

    async editDepartment(req, res, next) {
        const deparment_id = req.params.id;
        const admin_name = req.user;
        const department_item = await Department.findOne({'_id': deparment_id});
        
        res.render('backend/department/add', {
            admin: mongooseToObject(admin_name),
            department_item: mongooseToObject(department_item),
            layout: 'backend',
            errors: req.session.errors
        });

        req.session.errors = null;

    }

    async postDepartment(req, res, next) {

        const errors = validationResult(req).array();
        
        if (errors != '') {
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('back')
        } else {
            var deparment_id = req.body.department_id;
            Department.findOne({ '_id': deparment_id }, async function(err, department) {
                if (err) {
                    console.log(err)
                }
                if (department) {
                    console.log('update department');
                    
                    department.name = req.body.name;
                    department.facility_status = req.body.facility_status;
                    
                    department.save();
                    // res.json({success: true, type: 'update', post});
                }
                if (!department) {
                    console.log('new department');
                    const newDepartment = new Department();
                    newDepartment.name = req.body.name;
                    newDepartment.facility_status = req.body.facility_status;
    
                    newDepartment.save();
                }
            })
    
            res.redirect(`/admin/department/list`);
        }
    }

    async deleteDepartment(req, res, next) {

        var deparment_id = req.body.department_id;
        
        Department.findOneAndDelete({_id: deparment_id }, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted department : ", docs);
            }
        });

        res.redirect('back');
    }
}

module.exports = new DepartmentController;