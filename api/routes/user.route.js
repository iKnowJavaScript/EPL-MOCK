const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/UserController');
const decode = require('../middlewares/decode');
//const { profileImage } = require('../helpers/upload');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router
  .route('/')

  /** POST /api/v1/user - creae a user */
  .post(validate(paramValidation.createUser, { abortEarly: false }), userCtrl.signup);

router.use(decode);

router.route('/:userId');
/** GET /api/v1/user/userId gets a user by id */

module.exports = router;