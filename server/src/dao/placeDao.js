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
  const toSave = {
    ...place,
    createdAt: place.createdAt || new Date().toISOString(),
  };
  await fs.writeFile(
    getPlacePath(toSave.id),
    JSON.stringify(toSave, null, 2),
    "utf8"
  );
  return toSave;
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

async function loadPlaceEntry(filePath) {
  const [raw, stat] = await Promise.all([
    fs.readFile(filePath, "utf8"),
    fs.stat(filePath),
  ]);

  let place = JSON.parse(raw);

  if (!place.createdAt) {
    place = {
      ...place,
      createdAt: new Date(stat.mtimeMs).toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(place, null, 2), "utf8");
  }

  return {
    place,
    sortTime: Date.parse(place.createdAt),
  };
}

function sortPlacesNewestFirst(entries) {
  return entries
    .sort((a, b) => b.sortTime - a.sortTime)
    .map((entry) => entry.place);
}

async function list() {
  await ensureDir();
  const files = await fs.readdir(placesDir);
  const entries = [];

  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const filePath = path.join(placesDir, file);
    entries.push(await loadPlaceEntry(filePath));
  }

  return sortPlacesNewestFirst(entries);
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

  const toSave = {
    ...place,
    createdAt: existing.createdAt || place.createdAt,
  };

  await fs.writeFile(
    getPlacePath(toSave.id),
    JSON.stringify(toSave, null, 2),
    "utf8"
  );
  return toSave;
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
