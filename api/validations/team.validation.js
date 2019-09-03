const { Joi } = require('celebrate');

module.exports = {
  create: {
    body: {
      name: Joi.string().required(),
      coach: Joi.string().required(),
      stadium: Joi.string().required(),
      owner: Joi.string(),
      founded: Joi.string(),
      isDeleted: Joi.boolean()
    }
  },
  editTeam: {
    body: {
      name: Joi.string(),
      coach: Joi.string(),
      stadium: Joi.string(),
      owner: Joi.string(),
      founded: Joi.string(),
      isDeleted: Joi.boolean()
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
