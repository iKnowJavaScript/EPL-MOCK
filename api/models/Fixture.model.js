const immutablePlugin = require('mongoose-immutable');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');
const formatQuery = require('../helpers/formatQuery');
const { generateLink } = require('../services/crypto.service');

const FixtureSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
    index: true
  },

  stadium: {
    type: String,
    required: true,
    index: true
  },
  home: {
    type: String,
    required: true,
    index: true
  },
  away: {
    type: String,
    required: true,
    index: true
  },
  home_team: {
    type: mongoose.Types.ObjectId,
    ref: 'team',
    index: true
  },
  away_team: {
    type: mongoose.Types.ObjectId,
    ref: 'team',
    index: true
  },
  result: {
    type: String,
    get: function(v) {
      return this.status === 'Pending' ? ' - ' : v;
    }
  },
  link: {
    type: String,
    get: v => generateLink(),
    default: generateLink(),
    immutable: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// make sure link cannot be change
FixtureSchema.plugin(immutablePlugin);

/**
 * Schema methods
 */
FixtureSchema.methods = {
  async update(obj) {
    for (key in obj) {
      this[key] = obj[key];
    }
    await this.save();
    return this;
  }
};

FixtureSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id)
        .populate({ path: 'home_team', select: 'name coach stadium' })
        .populate({ path: 'away_team', select: 'name coach' })
        .exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  },

  async getBy(option) {
    try {
      const res = await this.find(option)
        .populate({ path: 'home_team', select: 'name coach stadium' })
        .populate({ path: 'away_team', select: 'name coach' })
        .exec();
      return res;
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  },

  async search(query) {
    try {
      let fixtures = [];
      let search = [
        { time: { $regex: query } },
        { status: { $regex: query } },
        { stadium: { $regex: query } },
        { home: { $regex: query } },
        { away: { $regex: query } }
      ];

      if (search.length) {
        fixtures = await this.find({
          $or: search
        })
          .populate({ path: 'home_team', select: 'name coach stadium' })
          .populate({ path: 'away_team', select: 'name coach' })
          .exec();
      }
      return fixtures;
    } catch (error) {
      throw new APIError(error);
    }
  }
};

module.exports = mongoose.model('fixture', FixtureSchema);
