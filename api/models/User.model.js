const mongoose = require('mongoose');
const EncodeToken = require('../helpers/tokenEncoder');
const bcryptService = require('../services/bcrypt.service');
const pick = require('ramda/src/pick');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
      required: true
    },
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

UserSchema.pre('save', async function(next) {
  try {
    this.password = await bcryptService().hashPassword(this);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods = {
  transform() {
    const fields = ['id', 'name', 'email', 'isAdmin', 'isDeleted'];
    return pick(fields, this);
  },
  token() {
    return EncodeToken(this.email, this._id, this.isAdmin);
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
};

UserSchema.statics = {
  async loginAndGenerateToken(payload) {
    const { email, password } = payload;

    if (!email) {
      throw new APIError({
        message: 'An email is required to generate a token'
      });
    }

    const user = await this.findOne({ email }).exec();

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };

    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect username or password';
    }
    throw new APIError(err);
  },

  async getOne(payload) {
    return this.findOne(payload).exec();
  },

  async getAll(payload) {
    return this.find(payload);
  }
};

module.exports = mongoose.model('user', UserSchema);
