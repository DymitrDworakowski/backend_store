const Joi = require('joi');

const userSchemaJoi = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const adminSchemaJoi = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  isAdmin: Joi.boolean().valid(true).required()
});

module.exports = { userSchemaJoi, adminSchemaJoi };
