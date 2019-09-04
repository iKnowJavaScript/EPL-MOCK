const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/UserController');
//const { profileImage } = require('../helpers/upload');
const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/v1/user - creae a user */
router
  .route('/register')
  .post(validate(paramValidation.createUser, { abortEarly: false }), userCtrl.signup);

// login a user
router.post('/login', validate(paramValidation.login, { abortEarly: false }), userCtrl.login);

// admin login
router.post('/admin/login', validate(paramValidation.login, { abortEarly: false }), userCtrl.login);

module.exports = router;
