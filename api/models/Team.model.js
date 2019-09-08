const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const formatQuery = require('../helpers/formatQuery');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 150,
    required: true,
    index: true
  },
  coach: {
    type: String,
    index: true,
    trim: true,
    maxlength: 150,
    required: true
  },
  stadium: {
    type: String,
    index: true,
    trim: true,
    maxlength: 150,
    required: true
  },
  address: {
    type: String,
    index: true,
    trim: true,
    maxlength: 150,
    default: ''
  },
  stadiumCapacity: {
    type: String,
    trim: true
  },
  founded: {
    type: String,
    trim: true,
    maxlength: 150,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    maxlength: 150,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

/**
 * Schema methods
 */
TeamSchema.methods = {
  async update(obj) {
    for (key in obj) {
      this[key] = obj[key];
    }
    await this.save();
    return this;
  }
};

TeamSchema.statics = {
  async get(id) {
    try {
      return await this.findById(id).exec();
    } catch (error) {
      throw new APIError({
        message: error.message,
        status: httpStatus.BAD_REQUEST
      });
    }
  },

  async getBy(option) {
    try {
      const res = await this.find(option).exec();
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
      let teams = [];
      let search = [
        { name: { $regex: query } },
        { coach: { $regex: query } },
        { stadium: { $regex: query } }
      ];

      if (search.length) {
        teams = await this.find({
          $or: search
        });
      }
      return teams;
    } catch (error) {
      throw new APIError(error);
    }
  }
};

module.exports = mongoose.model('team', TeamSchema);
