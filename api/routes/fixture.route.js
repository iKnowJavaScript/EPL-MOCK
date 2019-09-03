const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const requestValidate = require('../validations/fixture.validation');
const decode = require('../middlewares/decode');
const adminAuth = require('../middlewares/adminAuth.middleware');
const fixtureCtrl = require('../controllers/fixtureController');
const router = express.Router(); // eslint-disable-line new-cap

/** Load team when API with id route parameter is hit */
router.param('id', fixtureCtrl.load);

// Route accesible by all users
router.use(decode);

// Get all teams
router.route('/').get(fixtureCtrl.getFixtures);

// Get a single team
router.route('/:id/').get(fixtureCtrl.getFixture);

// only admin can acces these route
router.use(adminAuth);

router
  .route('/')
  // create a team
  .post(validate(requestValidate.create, { abortEarly: false }), fixtureCtrl.create);

router
  .route('/:id')
  .put(validate(requestValidate.editFixture, { abortEarly: false }), fixtureCtrl.editFixture);

router
  .route('/:id/delete')
  .put(validate(requestValidate.delete, { abortEarly: false }), fixtureCtrl.deleteFixture);

module.exports = router;
