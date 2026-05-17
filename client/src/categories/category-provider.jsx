import { createContext, useState, useEffect } from "react";
import FetchHelper from "../fetch-helper.js";
import { apiMessageCs } from "../common/api-messages";

export const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [state, setState] = useState();

  const clearError = () => {
    setError(undefined);
    if (state === "errorDeleting" || state === "errorCreating") {
      setState("success");
    }
  };

  const fetchCategories = async () => {
    setState("loading");
    const result = await FetchHelper.category.list();

    if (result.ok) {
      setData({ itemList: Array.isArray(result.data) ? result.data : [] });
      setState("success");
      setError(undefined);
    } else {
      setError(
        apiMessageCs(
          result.data?.message,
          "Nepodařilo se načíst kategorie."
        )
      );
      setState("error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (name) => {
    setState("creating");
    setError(undefined);
    const result = await FetchHelper.category.create({ name });

    if (result.ok) {
      setData((currentData) => ({
        itemList: [...(currentData?.itemList ?? []), result.data],
      }));
      setState("success");
      return { ok: true };
    }

    const message = apiMessageCs(
      result.data?.message,
      "Nepodařilo se vytvořit kategorii."
    );
    setError(message);
    setState("errorCreating");
    return { ok: false, message, error: result.data };
  };

  const handleUpdate = async (id, name, options = {}) => {
    setState("updating_" + id);
    if (!options.silent) {
      setError(undefined);
    }
    const result = await FetchHelper.category.update({ id, name });

    if (result.ok) {
      setData((currentData) => {
        const itemList = [...currentData.itemList];
        const itemIndex = itemList.findIndex((item) => item.id === id);
        itemList[itemIndex] = result.data;
        return { itemList };
      });
      setState("success");
      return { ok: true };
    }

    const message = apiMessageCs(
      result.data?.message,
      "Nepodařilo se upravit kategorii."
    );
    if (!options.silent) {
      setError(message);
      setState("errorCreating");
    }
    return { ok: false, message, error: result.data };
  };

  const handleDelete = async (id, options = {}) => {
    setState("deleting_" + id);
    if (!options.silent) {
      setError(undefined);
    }
    const result = await FetchHelper.category.delete({ id });

    if (result.ok) {
      setData((currentData) => ({
        itemList: currentData.itemList.filter((item) => item.id !== id),
      }));
      setState("success");
      return { ok: true };
    }

    const message = apiMessageCs(
      result.data?.message,
      "Kategorii nelze smazat, protože obsahuje místa."
    );
    if (!options.silent) {
      setError(message);
      setState("errorDeleting");
    }
    return { ok: false, message, error: result.data };
  };

  return (
    <CategoryContext.Provider
      value={{
        data,
        state,
        error,
        handlerMap: {
          handleCreate,
          handleUpdate,
          handleDelete,
          fetchCategories,
          clearError,
        },
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
