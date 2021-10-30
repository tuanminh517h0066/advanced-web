const Student = require('../models/Student');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class StudentsController {

    // get list of student
    listStudent(req, res, next) {
        Student.find({})
        .then( students => {
            
            res.render('studentList', {
                students: mutipleMongooseToObject(students)
            })
        })
        .catch(next);
    }

    //get create student template
    create(req, res, next) {
        res.render('createStudent');
    }

    // post student
    store(req, res, next) {

        const student = new Student(req.body);
        student.save().then(() => res.redirect('/student/list' ) );
    }

    // get edit form
    edit(req, res, next) {
        Student.findById(req.params.id)
        .then( student => {
            res.render('editStudent', {
                student: mongooseToObject(student)
            })
        })
        .catch(next);
    }
    // post update student
    update(req, res, next) {
        Student.updateOne({ _id: req.params.id }, req.body)
        .then( () => res.redirect('/student/list') )
        .catch(next);
    }

    // delete student
    delete(req, res, next) {
        Student.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next);
    }
}


module.exports = new StudentsController;