const express = require('express');
const httpStatus = require('http-status');
const userRoutes = require('./user.route');
const sendResponse = require('../helpers/response');
const adminRoutes = require('./admin.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/user', userRoutes);

//mount admin routes at /admin
router.use('/admin', adminRoutes);

module.exports = router;
