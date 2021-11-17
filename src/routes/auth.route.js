const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
var passport = require('passport')

router.get('/', authController.getLogin);



module.exports = router;