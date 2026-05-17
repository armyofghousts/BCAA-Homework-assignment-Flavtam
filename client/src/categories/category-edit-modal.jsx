import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { CategoryContext } from "./category-provider";

function CategoryEditModal({ category, onClose }) {
  const { handlerMap } = useContext(CategoryContext);
  const [name, setName] = useState(category.name);
  const [error, setError] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSave = async () => {
    setError();
    setPending(true);
    const result = await handlerMap.handleUpdate(category.id, name.trim(), {
      silent: true,
    });
    setPending(false);

    if (result?.ok) {
      onClose();
    } else {
      setError(
        result?.message || "Nepodařilo se uložit změny kategorie."
      );
    }
  };

  const handleDelete = async () => {
    setError();
    setPending(true);
    const result = await handlerMap.handleDelete(category.id, { silent: true });
    setPending(false);

    if (result?.ok) {
      onClose();
    } else {
      setConfirmDelete(false);
      setError(
        result?.message ||
          "Kategorii nelze smazat, protože obsahuje místa."
      );
    }
  };

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      contentClassName="flavtam-modal-content"
      dialogClassName="flavtam-modal-dialog--form"
    >
      <Modal.Header closeButton>
        <Modal.Title>Upravit kategorii</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}

        {!confirmDelete ? (
          <>
            <Form.Label>Název kategorie</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={pending}
              autoFocus
            />
          </>
        ) : (
          <p className="mb-0">
            Opravdu chcete smazat kategorii <strong>{category.name}</strong>?
            Tuto akci nelze vrátit zpět.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!confirmDelete ? (
          <>
            <Button variant="secondary" onClick={onClose} disabled={pending}>
              Zavřít
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => {
                setError();
                setConfirmDelete(true);
              }}
              disabled={pending || !name.trim()}
            >
              Smazat kategorii
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={
                pending || !name.trim() || name.trim() === category.name
              }
            >
              {pending ? "Ukládám…" : "Uložit změny"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(false)}
              disabled={pending}
            >
              Zpět
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={pending}
            >
              {pending ? "Mažu…" : "Ano, smazat"}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CategoryEditModal;
