const express = require('express');
const router = express.Router();
const userMiddleware = require('../app/middleware/UserMiddleware');
const DepartmentController = require('../app/controllers/frontend/DepartmentController');

router.get('/list', userMiddleware.isMember, DepartmentController.list );

module.exports = router;