import { CategoryContext } from "./category-provider";
import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import CategoryEditModal from "./category-edit-modal";
import Loading from "../common/loading";

function Category({ data }) {
  const { state, handlerMap } = useContext(CategoryContext);
  const [newName, setNewName] = useState("");
  const [editCategory, setEditCategory] = useState();

  const handleCreate = async () => {
    const result = await handlerMap.handleCreate(newName.trim());
    if (result?.ok) {
      setNewName("");
    }
  };

  if (!data?.id) {
    return (
      <div className="category-row category-row--create">
        <Form.Control
          type="text"
          className="category-field"
          placeholder="Název kategorie"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={state === "creating"}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newName.trim()) {
              handleCreate();
            }
          }}
        />
        <Button
          variant="primary"
          onClick={handleCreate}
          size="sm"
          className="category-add-btn"
          disabled={!newName.trim() || state === "creating"}
          aria-label="Přidat kategorii"
        >
          {state === "creating" ? (
            <Loading size={20} />
          ) : (
            <Icon path={mdiPlus} size={1} />
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      {editCategory ? (
        <CategoryEditModal
          category={editCategory}
          onClose={() => setEditCategory()}
        />
      ) : null}
      <div className="category-row">
        <div className="category-field category-field--readonly">{data.name}</div>
        <Button
          variant="outline-secondary"
          size="sm"
          className="category-edit-btn"
          onClick={() => setEditCategory(data)}
        >
          Upravit
        </Button>
      </div>
    </>
  );
}

export default Category;
