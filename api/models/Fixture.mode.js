const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { generateLink } = require('../services/crypto.service');
const immutablePlugin = require('mongoose-immutable');

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
    default: 'Pending'
  },

  stadium: {
    type: String,
    required: true
  },

  home_team: {
    type: mongoose.Types.ObjectId,
    ref: 'team'
  },
  away_team: {
    type: mongoose.Types.ObjectId,
    ref: 'team'
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
  }
};

module.exports = mongoose.model('fixture', FixtureSchema);
