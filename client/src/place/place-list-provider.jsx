import { createContext, useState, useEffect } from "react";

import FetchHelper from "../fetch-helper.js";
import { mapApiError } from "../common/api-messages";

export const PlaceListContext = createContext();

function PlaceListProvider({ children }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [placeListDto, setPlaceListDto] = useState({
    state: "ready",
    data: null,
    error: null,
  });

  async function handleLoad() {
    setPlaceListDto((current) => {
      return { ...current, data: undefined, state: "pending" };
    });

    const dtoIn = selectedCategoryId ? { categoryId: selectedCategoryId } : null;
    const result = await FetchHelper.place.listWithCategories(dtoIn);

    setPlaceListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      }
      return {
        ...current,
        state: "error",
        error: mapApiError(result.data, "Nepodařilo se načíst místa."),
      };
    });
  }

  /* eslint-disable */
  useEffect(() => {
    handleLoad();
  }, [selectedCategoryId]);
  /* eslint-enable */

  async function handleCreate(dtoIn) {
    setPlaceListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.place.create(dtoIn);

    if (!result.ok) {
      const apiError = mapApiError(result.data, "Nepodařilo se vytvořit místo.");
      setPlaceListDto((current) => ({
        ...current,
        state: "error",
        error: apiError,
      }));
      return { ok: false, error: apiError };
    }

    const filter = selectedCategoryId ? { categoryId: selectedCategoryId } : null;
    const reload = await FetchHelper.place.listWithCategories(filter);

    if (reload.ok) {
      setPlaceListDto({
        state: "ready",
        data: reload.data,
        error: null,
      });
    } else {
      setPlaceListDto((current) => {
        if (!current.data) {
          return {
            ...current,
            state: "error",
            error: mapApiError(reload.data, "Nepodařilo se načíst místa."),
          };
        }
        current.data.itemList.unshift(result.data);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
        };
      });
    }

    return { ok: true };
  }

  async function handleUpdate(dtoIn) {
    setPlaceListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.place.update(dtoIn);
    setPlaceListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = result.data;
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          pendingId: undefined,
        };
      }
      return {
        ...current,
        state: "error",
        error: mapApiError(result.data, "Nepodařilo se upravit místo."),
        pendingId: undefined,
      };
    });
    return {
      ok: result.ok,
      error: result.ok
        ? undefined
        : mapApiError(result.data, "Nepodařilo se upravit místo."),
    };
  }

  async function handleDelete(dtoIn) {
    setPlaceListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.place.delete(dtoIn);
    setPlaceListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList.splice(itemIndex, 1);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
        };
      }
      return {
        ...current,
        state: "error",
        error: mapApiError(result.data, "Nepodařilo se smazat místo."),
      };
    });
    return {
      ok: result.ok,
      error: result.ok
        ? undefined
        : mapApiError(result.data, "Nepodařilo se smazat místo."),
    };
  }

  const value = {
    ...placeListDto,
    selectedCategoryId,
    setSelectedCategoryId,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete },
  };

  return (
    <PlaceListContext.Provider value={value}>
      {children}
    </PlaceListContext.Provider>
  );
}

export default PlaceListProvider;
