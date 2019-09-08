const express = require('express');
const fixtureCtrl = require('../controllers/fixtureController');
const teamCtrl = require('../controllers/teamController');

const router = express.Router(); // eslint-disable-line new-cap

// search for teams
router.route('/team').get(teamCtrl.searchTeam);

// search for fixtures
router.route('/fixture').get(fixtureCtrl.searchFixture);

module.exports = router;
