const { v4: uuidv4 } = require("uuid");
const categoryDao = require("../dao/categoryDao");
const placeDao = require("../dao/placeDao");

function normalizedCategoryName(name) {
  return name.trim().toLowerCase();
}

async function assertUniqueCategoryName(name, excludeCategoryId = null) {
  const target = normalizedCategoryName(name);
  const categories = await categoryDao.list();
  const conflict = categories.some(
    (c) =>
      normalizedCategoryName(c.name) === target &&
      (excludeCategoryId === null || c.id !== excludeCategoryId),
  );

  if (conflict) {
    const error = new Error("Category name already exists.");
    error.statusCode = 409;
    throw error;
  }
}

async function createCategory(data) {
  await assertUniqueCategoryName(data.name);

  const category = {
    id: uuidv4(),
    name: data.name,
  };

  return categoryDao.create(category);
}

async function listCategories() {
  return categoryDao.list();
}

async function getCategoryById(id) {
  return categoryDao.getById(id);
}

async function updateCategory(data) {
  await assertUniqueCategoryName(data.name, data.id);

  return categoryDao.update({
    id: data.id,
    name: data.name,
  });
}

async function deleteCategory(id) {
  const placesInCategory = await placeDao.listByCategoryId(id);

  if (placesInCategory.length > 0) {
    const error = new Error("Category contains places and cannot be deleted.");
    error.statusCode = 409;
    throw error;
  }

  return categoryDao.remove(id);
}

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
