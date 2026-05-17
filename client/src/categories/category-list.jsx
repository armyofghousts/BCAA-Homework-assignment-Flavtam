import { useContext } from "react";
import Alert from "react-bootstrap/Alert";
import { CategoryContext } from "./category-provider";
import Category from "./category";

function CategoryList() {
  const { data, state, error, handlerMap } = useContext(CategoryContext);

  const showError =
    error && (state === "errorCreating" || state === "error");

  return (
    <div>
      <h1 className="mb-4">Seznam kategorií</h1>

      {showError ? (
        <Alert
          variant="danger"
          dismissible
          onClose={() => handlerMap.clearError()}
          className="mb-3"
        >
          {error}
        </Alert>
      ) : null}

      <div>
        <Category />
      </div>
      {data?.itemList?.length > 0 ? (
        data.itemList.map((category) => (
          <Category key={category.id} data={category} />
        ))
      ) : (
        <div className="text-muted">Není vyplněna žádná kategorie</div>
      )}
    </div>
  );
}

export default CategoryList;
