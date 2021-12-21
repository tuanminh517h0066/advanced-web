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

}

module.exports = new DepartmentController;