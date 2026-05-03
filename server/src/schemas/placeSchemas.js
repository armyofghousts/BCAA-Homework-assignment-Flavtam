const Joi = require("joi");

const difficultyValues = ["easy", "medium", "hard", "very hard", "unknown"];

const placeBaseSchema = {
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow("").optional(),
  location: Joi.string().trim().allow("").optional(),
  difficulty: Joi.string().valid(...difficultyValues).required(),
  images: Joi.array().items(Joi.string().trim().min(1)).optional().default([]),
  rating: Joi.number().integer().min(1).max(5).optional(),
  categoryId: Joi.string().required(),
};

const placeCreateSchema = Joi.object(placeBaseSchema);

const placeUpdateSchema = Joi.object({
  id: Joi.string().required(),
  ...placeBaseSchema,
});

const placeIdSchema = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  placeCreateSchema,
  placeUpdateSchema,
  placeIdSchema,
};
