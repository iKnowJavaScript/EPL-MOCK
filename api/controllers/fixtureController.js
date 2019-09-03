require('dotenv').config();
const httpStatus = require('http-status');
const Fixture = require('../models/Fixture.mode');
const sendResponse = require('../helpers/response');

const TeamController = () => {
  const load = async (req, res, next, id) => {
    try {
      let fixture = await Fixture.get(id);
      if (fixture) {
        req.fixture = fixture;
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  const create = async (req, res, next) => {
    try {
      const fixture = new Fixture(req.body);
      await fixture.save();
      res.json(sendResponse(httpStatus.OK, 'Fixture successfully added', fixture));
    } catch (error) {
      next(error);
    }
  };

  const editFixture = async (req, res) => {
    if (req.fixture.isDeleted) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Fixture already deleted', null));
    }
    try {
      const fixture = await req.fixture.update(req.body);
      res.json(sendResponse(httpStatus.OK, 'succesful', fixture));
    } catch (error) {
      res.json(sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
  };

  const deleteFixture = async (req, res) => {
    const { isDeleted } = req.body;
    if (req.fixture.isDeleted) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Fixture already deleted', null));
    }
    try {
      await req.fixture.update({ isDeleted });
      res.json(sendResponse(httpStatus.OK, 'succesful', null));
    } catch (error) {
      res.json(sendResponse(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong'));
    }
  };

  const getFixture = async (req, res, next) => {
    try {
      let fixture = req.fixture;
      if (fixture.isDeleted) {
        return res.json(sendResponse(httpStatus.NOT_FOUND, 'Team already deleted ', null));
      }
      return res.json(sendResponse(httpStatus.OK, 'Success', fixture));
    } catch (error) {
      next(error);
    }
  };

  const getFixtures = async (req, res, next) => {
    try {
      let fixtures = await Fixture.getBy({ isDeleted: false });
      return res.json(sendResponse(httpStatus.OK, 'Success', fixtures));
    } catch (error) {
      next(error);
    }
  };

  return {
    load,
    create,
    editFixture,
    deleteFixture,
    getFixture,
    getFixtures
  };
};

module.exports = TeamController();
