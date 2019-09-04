const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/UserController');
const decode = require('../middlewares/decode');
//const { profileImage } = require('../helpers/upload');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);


router.post('/login', validate(paramValidation.login, { abortEarly: false }), userCtrl.login);

router.use(decode);

router.route('/:userId');
/** GET /api/v1/user/userId gets a user by id */

module.exports = router;
