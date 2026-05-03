const Joi = require("joi");

const categoryCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
});

const categoryUpdateSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().trim().min(1).required(),
});

const categoryIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryIdSchema,
};
