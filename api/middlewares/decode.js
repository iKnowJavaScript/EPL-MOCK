const tokendecoder = require('../helpers/TokenDecoder');
const sendResponse = require('../helpers/response');
const httpStatus = require('http-status');
const User = require('../models/User.model');

module.exports = async (req, res, next) => {
  try {
    const { decodeToken } = tokendecoder(req, res);
    const { sub } = decodeToken;
    const user = await User.getOne({ _id: sub });
    if (user) {
      req.sub = sub;
      req.user = user;
      //handle session
      // if (!req.session[sub]) {
      //   return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Your session has expired', null));
      // }
      return next();
    }

    return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unapproved User', null));
  } catch (error) {
    next(error);
  }
};
