require('dotenv').config();
const httpStatus = require('http-status');
const User = require('../models/User.model');
const sendResponse = require('../helpers/response');

const UserController = () => {
  const load = async (req, res, next, id) => {
    try {
      let user = await User.getOne({ _id: id });
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  const signup = async (req, res, next) => {
    try {
      const { email } = req.body;

      const userExist = await User.getOne({ email: email });

      if (userExist) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'email has been taken',
            {},
            { email: 'email has been taken' }
          )
        );
      }
      const user = await User.create(req.body);
      const token = user.token();

      // Set up redis session
      req.session[user._id] = { token, email: user.email };
      return res.json(sendResponse(httpStatus.OK, 'success', user.transform(), null, token));
    } catch (err) {
      next(err);
    }
  };

  const login = async (req, res, next) => {
    try {
      const { user, accessToken } = await User.loginAndGenerateToken(req.body);
      // Set up redis session
      req.session[user._id] = { token: accessToken, email: user.email };

      return res.json(
        sendResponse(200, 'Successfully logged in', user.transform(), false, accessToken)
      );
    } catch (error) {
      next(error);
    }
  };

  const getAllUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unauthorized', false, 'Unauthorized'));
    }
    try {
      const query = req.body;
      const users = await User.getAll(query);
      return res.json(sendResponse(httpStatus.OK, 'success', users, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    signup,
    login,
    getAllUser,
    load
  };
};

module.exports = UserController();
