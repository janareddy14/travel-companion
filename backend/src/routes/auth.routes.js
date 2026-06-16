const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

router.post('/register', authValidator.registerValidation, authValidator.validate, authController.register);
router.post('/login', authValidator.loginValidation, authValidator.validate, authController.login);

module.exports = router;
