const { placeCreateSchema, placeUpdateSchema, placeIdSchema } = require("../schemas/placeSchemas");
const placeService = require("../services/placeService");

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
    const data = validate(placeCreateSchema, req.body);
    const place = await placeService.createPlace(data);
    res.status(201).json(place);
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const raw = req.query.categoryId;
    const categoryId =
      typeof raw === "string" && raw.trim() !== "" ? raw.trim() : undefined;

    const places = await placeService.listPlaces(categoryId);
    res.status(200).json(places);
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const { id } = validate(placeIdSchema, req.params);
    const place = await placeService.getPlaceById(id);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.status(200).json(place);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = validate(placeUpdateSchema, req.body);
    const place = await placeService.updatePlace(data);

    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.status(200).json(place);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = validate(placeIdSchema, req.body);
    const deleted = await placeService.deletePlace(id);

    if (!deleted) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.status(200).json({ message: "Place deleted." });
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
