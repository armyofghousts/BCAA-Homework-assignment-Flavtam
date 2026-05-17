import { useContext, useMemo, useState } from "react";

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "react-bootstrap/Pagination";
import Icon from "@mdi/react";
import { mdiFilterVariant } from "@mdi/js";

import { PlaceListContext } from "./place-list-provider";
import PlaceItem from "./place-item";
import PlaceItemForm from "./place-item-form";
import PlaceItemDeleteDialog from "./place-item-delete-dialog";
import PlaceDetailModal from "./place-detail-modal";
import Loading from "../common/loading";
import Error from "../common/error";
import { apiMessageCs } from "../common/api-messages";
import "./places.css";

const ITEMS_PER_PAGE = 5;

function PlacesContent() {
  const [formItem, setFormItem] = useState();
  const [placeItemDeleteDialog, setPlaceItemDeleteDialog] = useState();
  const [placeDetail, setPlaceDetail] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { state, data, error, selectedCategoryId, setSelectedCategoryId } =
    useContext(PlaceListContext);

  const categoryOptions = useMemo(() => {
    return Object.values(data?.categoryMap ?? {});
  }, [data]);

  const filteredPlaces = useMemo(() => {
    return data?.itemList ?? [];
  }, [data]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE)
  );

  const paginatedPlaces = useMemo(() => {
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPlaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlaces, currentPage, totalPages]);

  const selectedCategoryName =
    selectedCategoryId && data?.categoryMap?.[selectedCategoryId]?.name;

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const errorMessage = apiMessageCs(
    error?.message,
    "Nepodařilo se načíst místa."
  );

  if (state === "error" && !data) {
    return (
      <div className="places-page">
        <div className="flavtam-error-page">
          <Error message={errorMessage} />
        </div>
      </div>
    );
  }

  const paginationItems = [];
  for (let page = 1; page <= totalPages; page += 1) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  return (
    <div className="places-page">
      {formItem !== undefined ? (
        <PlaceItemForm
          item={formItem}
          onClose={(result) => {
            setFormItem(undefined);
            if (result?.created) {
              setCurrentPage(1);
            }
          }}
        />
      ) : null}

      {!!placeItemDeleteDialog ? (
        <PlaceItemDeleteDialog
          item={placeItemDeleteDialog}
          onClose={() => setPlaceItemDeleteDialog()}
        />
      ) : null}

      {placeDetail ? (
        <PlaceDetailModal
          place={placeDetail}
          categoryName={data?.categoryMap?.[placeDetail.categoryId]?.name}
          onClose={() => setPlaceDetail()}
          onEdit={(place) => {
            setPlaceDetail();
            setFormItem(place);
          }}
        />
      ) : null}

      <div className="places-toolbar">
        <div className="places-toolbar-actions">
          <Button
            variant="primary"
            className="btn-create-place"
            disabled={state === "pending"}
            onClick={() => setFormItem({})}
          >
            Přidat místo
          </Button>
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-secondary"
              className="btn-filter"
              disabled={state === "pending"}
            >
              <Icon path={mdiFilterVariant} size={0.85} />
              {selectedCategoryName || "Filtrovat podle kategorie"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={!selectedCategoryId}
                onClick={() => handleCategoryFilter("")}
              >
                Všechny kategorie
              </Dropdown.Item>
              {categoryOptions.map((category) => (
                <Dropdown.Item
                  key={category.id}
                  active={selectedCategoryId === category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="places-list">
        {state === "pending" && !data ? (
          <div className="flavtam-loading-center">
            <Loading size={52} />
          </div>
        ) : null}

        {data && paginatedPlaces.length === 0 ? (
          <div className="places-empty">Žádná místa k zobrazení.</div>
        ) : null}

        {data
          ? paginatedPlaces.map((place) => (
              <PlaceItem
                key={place.id}
                item={place}
                categoryName={data.categoryMap?.[place.categoryId]?.name}
                onOpenDetail={setPlaceDetail}
                onDelete={setPlaceItemDeleteDialog}
              />
            ))
          : null}
      </div>

      {state === "error" && data ? (
        <div className="flavtam-error-page flavtam-error-page--inline">
          <Error message={errorMessage} />
        </div>
      ) : null}

      {data && filteredPlaces.length > 0 ? (
        <Pagination className="places-pagination">{paginationItems}</Pagination>
      ) : null}
    </div>
  );
}

export default PlacesContent;
