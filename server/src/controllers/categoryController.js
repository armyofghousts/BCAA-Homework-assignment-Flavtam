const {
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryIdSchema,
} = require("../schemas/categorySchemas");
const categoryService = require("../services/categoryService");

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((item) => item.message);
    const validationError = new Error("Validation error");
    validationError.statusCode = 400;
    validationError.details = details;
    throw validationError;
  }
  return value;
}

async function create(req, res, next) {
  try {
    const data = validate(categoryCreateSchema, req.body);
    const category = await categoryService.createCategory(data);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const categories = await categoryService.listCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const { id } = validate(categoryIdSchema, req.params);
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = validate(categoryUpdateSchema, req.body);
    const category = await categoryService.updateCategory(data);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = validate(categoryIdSchema, req.body);
    const deleted = await categoryService.deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  get,
  update,
  remove,
};
