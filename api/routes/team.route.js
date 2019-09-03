const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const requestValidate = require('../validations/team.validation');
const decode = require('../middlewares/decode');
const adminAuth = require('../middlewares/adminAuth.middleware');
const teamCtrl = require('../controllers/teamController');
const router = express.Router(); // eslint-disable-line new-cap

/** Load team when API with id route parameter is hit */
router.param('id', teamCtrl.load);

// Route accesible by all users
router.use(decode);

// Get all teams
router.route('/').get(teamCtrl.getTeams);

// Get a single team
router.route('/:id/').get(teamCtrl.getTeam);

// only admin can acces these route
router.use(adminAuth);

router
  .route('/')
  // create a team
  .post(validate(requestValidate.create, { abortEarly: false }), teamCtrl.create);

router
  .route('/:id')
  .put(validate(requestValidate.editTeam, { abortEarly: false }), teamCtrl.editTeam);

router
  .route('/:id/delete')
  .put(validate(requestValidate.delete, { abortEarly: false }), teamCtrl.deleteTeam);

module.exports = router;
