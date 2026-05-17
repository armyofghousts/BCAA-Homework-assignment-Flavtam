const { v4: uuidv4 } = require("uuid");
const placeDao = require("../dao/placeDao");
const categoryDao = require("../dao/categoryDao");

async function createPlace(data) {
  const category = await categoryDao.getById(data.categoryId);
  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  const place = {
    id: uuidv4(),
    name: data.name,
    description: data.description ?? "",
    location: data.location ?? "",
    difficulty: data.difficulty,
    images: data.images,
    rating: data.rating ?? 1,
    categoryId: data.categoryId,
    createdAt: new Date().toISOString(),
  };

  return placeDao.create(place);
}

async function listPlaces(categoryId) {
  if (!categoryId) {
    return placeDao.list();
  }

  const category = await categoryDao.getById(categoryId);
  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return placeDao.listByCategoryId(categoryId);
}

async function getPlaceById(id) {
  return placeDao.getById(id);
}

async function updatePlace(data) {
  const existing = await placeDao.getById(data.id);
  if (!existing) {
    return null;
  }

  const category = await categoryDao.getById(data.categoryId);
  if (!category) {
    const error = new Error("Category not found.");
    error.statusCode = 404;
    throw error;
  }

  return placeDao.update({
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    location: data.location ?? "",
    difficulty: data.difficulty,
    images: data.images,
    rating: data.rating ?? 1,
    categoryId: data.categoryId,
    createdAt: existing.createdAt,
  });
}

async function deletePlace(id) {
  return placeDao.remove(id);
}

module.exports = {
  createPlace,
  listPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
};
