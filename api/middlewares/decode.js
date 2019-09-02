const tokendecoder = require('../helpers/TokenDecoder');
const sendResponse = require('../helpers/response');
const httpStatus = require('http-status');
const { UserQuery } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { decodeToken } = tokendecoder(req, res);
    const { sub } = decodeToken;
    const user = await UserQuery.get(sub);
    if (user) {
      req.sub = sub;
      req.user = user;
      return next();
    }

    return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unapproved User', null));
  } catch (error) {
    next(error);
  }
};
