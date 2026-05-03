const fs = require("fs/promises");
const path = require("path");

const categoriesDir = path.join(__dirname, "..", "storage", "categories");

async function ensureDir() {
  await fs.mkdir(categoriesDir, { recursive: true });
}

function getCategoryPath(id) {
  return path.join(categoriesDir, `${id}.json`);
}

async function create(category) {
  await ensureDir();
  await fs.writeFile(getCategoryPath(category.id), JSON.stringify(category, null, 2), "utf8");
  return category;
}

async function getById(id) {
  try {
    const raw = await fs.readFile(getCategoryPath(id), "utf8");
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
  const files = await fs.readdir(categoriesDir);
  const categories = [];

  for (const file of files) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const raw = await fs.readFile(path.join(categoriesDir, file), "utf8");
    categories.push(JSON.parse(raw));
  }

  return categories;
}

async function update(category) {
  const existing = await getById(category.id);
  if (!existing) {
    return null;
  }

  await fs.writeFile(getCategoryPath(category.id), JSON.stringify(category, null, 2), "utf8");
  return category;
}

async function remove(id) {
  try {
    await fs.unlink(getCategoryPath(id));
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
  update,
  remove,
};
