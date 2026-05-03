const fs = require("fs/promises");
const path = require("path");

const placesDir = path.join(__dirname, "..", "storage", "places");

async function ensureDir() {
  await fs.mkdir(placesDir, { recursive: true });
}

function getPlacePath(id) {
  return path.join(placesDir, `${id}.json`);
}

async function create(place) {
  await ensureDir();
  await fs.writeFile(getPlacePath(place.id), JSON.stringify(place, null, 2), "utf8");
  return place;
}

async function getById(id) {
  try {
    const raw = await fs.readFile(getPlacePath(id), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function list() {
  await ensureDir();
  const files = await fs.readdir(placesDir);
  const places = [];

  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const raw = await fs.readFile(path.join(placesDir, file), "utf8");
    places.push(JSON.parse(raw));
  }

  return places;
}

async function listByCategoryId(categoryId) {
  const places = await list();
  return places.filter((place) => place.categoryId === categoryId);
}

async function update(place) {
  const existing = await getById(place.id);
  if (!existing) {
    return null;
  }

  await fs.writeFile(getPlacePath(place.id), JSON.stringify(place, null, 2), "utf8");
  return place;
}

async function remove(id) {
  try {
    await fs.unlink(getPlacePath(id));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

module.exports = {
  create,
  getById,
  list,
  listByCategoryId,
  update,
  remove,
};
