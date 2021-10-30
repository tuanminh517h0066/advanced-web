const express = require('express');
const router = express.Router();
const studentsController = require('../app/controllers/StudentsController');

router.get('/list', studentsController.listStudent);
router.get('/add', studentsController.create);
router.post('/store', studentsController.store);
router.get('/edit/:id', studentsController.edit);
router.post('/update/:id', studentsController.update);
router.get('/delete/:id', studentsController.delete);

module.exports = router;