const Department = require('../../models/Department')
const Member = require('../../models/Member');


const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class MemberController {
    listMember(req, res, next) {

        res.render('backend/member/index');
    }

    async memberForm(req, res, next) {
        const departments = await Department.find({});
        console.log(departments);

        res.render('backend/member/add', {
            departments: mutipleMongooseToObject(departments)
        });
    }

    post(req, res, next) {

        const member = new Member();

        member.email = req.body.email;
        member.username = req.body.username;
        member.password = member.encryptPassword('123456');
        member.department_id = req.body.department_id;
        member.role = 1;

        member.save(function(err) {
            if (err) console.log(err);
        });

        return res.redirect('/admin/index');
        
    }
}

module.exports = new MemberController;