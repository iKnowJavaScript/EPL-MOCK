const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 150,
    required: true
  },
  coach: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
    required: true
  },
  stadium: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
    required: true
  },
  owner: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
    default: ''
  },
  founded: {
    type: String,
    trim: true,
    minlength: 2,
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
  }
};

module.exports = mongoose.model('team', TeamSchema);
