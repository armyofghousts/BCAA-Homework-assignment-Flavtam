const baseUri = process.env.REACT_APP_API_URL || "";

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return { message: response.statusText || "Unexpected response." };
  }
}

async function Call(base, useCase, dtoIn, method) {
  let response;
  if (!method || method === "get") {
    const query =
      dtoIn && Object.keys(dtoIn).length
        ? `?${new URLSearchParams(dtoIn)}`
        : "";
    response = await fetch(`${base}/${useCase}${query}`);
  } else {
    response = await fetch(`${base}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await parseJson(response);
  return { ok: response.ok, status: response.status, data };
}

function asItemList(data) {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.itemList ?? [];
}

function buildCategoryMap(categories) {
  return Object.fromEntries(categories.map((category) => [category.id, category]));
}

const FetchHelper = {
  category: {
    get: async (dtoIn) => {
      const response = await fetch(`${baseUri}/category/get/${dtoIn.id}`);
      const data = await parseJson(response);
      return { ok: response.ok, status: response.status, data };
    },
    create: async (dtoIn) => Call(baseUri, "category/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "category/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "category/delete", dtoIn, "post"),
    list: async () => Call(baseUri, "category/list", null, "get"),
  },

  place: {
    get: async (dtoIn) => {
      const response = await fetch(`${baseUri}/place/get/${dtoIn.id}`);
      const data = await parseJson(response);
      return { ok: response.ok, status: response.status, data };
    },
    create: async (dtoIn) => Call(baseUri, "place/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "place/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "place/delete", dtoIn, "post"),
    list: async (dtoIn) => Call(baseUri, "place/list", dtoIn, "get"),
    listWithCategories: async (dtoIn) => {
      const [categoryResult, placeResult] = await Promise.all([
        FetchHelper.category.list(),
        FetchHelper.place.list(dtoIn),
      ]);

      if (!categoryResult.ok) {
        return categoryResult;
      }
      if (!placeResult.ok) {
        return placeResult;
      }

      const categories = asItemList(categoryResult.data);
      return {
        ok: true,
        status: 200,
        data: {
          itemList: asItemList(placeResult.data),
          categoryMap: buildCategoryMap(categories),
        },
      };
    },
  },
};

export default FetchHelper;
