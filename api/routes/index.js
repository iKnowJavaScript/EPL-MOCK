const express = require('express');
const userRoutes = require('./user.route');
const teamRoutes = require('./team.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const searchRoutes = require('./search.route');
const fixtureRoutes = require('./fixture.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/user', userRoutes);

// mount admin routes at /admin
router.use('/admin', adminRoutes);

// mount admin routes at /admin
router.use('/auth', authRoutes);

// mount team routes at /team
router.use('/team', teamRoutes);

// mount fixture routes at /fixture
router.use('/fixture', fixtureRoutes);

// mount search routes at /search
router.use('/search', searchRoutes);

module.exports = router;
