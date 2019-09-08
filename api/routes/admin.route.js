const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const decode = require('../middlewares/decode');
const adminAuth = require('../middlewares/adminAuth.middleware');
const userCtrl = require('../controllers/UserController');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

/** Ensures the user is an admin */
router
  .route('/')
  /** GET /api/v1/users - get all users */

  /** POST /api/v1/admin - creae a user */
  .post(
    validate(paramValidation.createUser, { abortEarly: false })
    // adminCtrl.createAdmin
  );

router.use(decode);
router.use(adminAuth);

router
  .route('/')
  /** GET /api/v1/users - get all users */
  .get(userCtrl.getAllUser);

module.exports = router;
