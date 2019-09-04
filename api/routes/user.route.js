const express = require('express');
const decode = require('../middlewares/decode');
const userCtrl = require('../controllers/UserController');
const { celebrate: validate, errors } = require('celebrate');
const fixtureCtrl = require('../controllers/fixtureController');
const paramValidation = require('../validations/user.validation');

const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router.post('/login', validate(paramValidation.login, { abortEarly: false }), userCtrl.login);

router.use(decode);

router.route('/:userId');
/** GET /api/v1/user/userId gets a user by id */

// search for pending fixtures
router.route('/fixture/pending').get(fixtureCtrl.getPendingFixtures);

// search for Completed fixtures
router.route('/fixture/completed').get(fixtureCtrl.getCompletedFixtures);

module.exports = router;
