const sendResponse = require('../helpers/response');
const { jwtSecret } = require('../../config/env');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

module.exports = req => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    throw new APIError({ message: 'Unauthorized', status: httpStatus.UNAUTHORIZED });
  }
  let token = authorization.split(' ')[1];
  return { token, decodeToken: jwt.decode(token, jwtSecret) };
};
