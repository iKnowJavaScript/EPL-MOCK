const { Joi } = require('celebrate');

module.exports = {
  create: {
    body: {
      date: Joi.date().required(),
      time: Joi.string().required(),
      home_team: Joi.string()
        .hex()
        .required(),
      away_team: Joi.string()
        .hex()
        .required(),
      stadium: Joi.string().required(),
      status: Joi.string(),
      result: Joi.string(),
      isDeleted: Joi.boolean(),
      home: Joi.string().required(),
      away: Joi.string().required()
    }
  },
  editFixture: {
    body: {
      date: Joi.date(),
      time: Joi.string(),
      home_team: Joi.string().hex(),
      away_team: Joi.string().hex(),
      stadium: Joi.string(),
      status: Joi.string(),
      result: Joi.string(),
      isDeleted: Joi.boolean(),
      home: Joi.string(),
      away: Joi.string()
    },
    params: {
      id: Joi.string().hex()
    }
  },
  delete: {
    body: {
      isDeleted: Joi.boolean().required()
    },
    params: {
      id: Joi.string().hex()
    }
  }
};
