import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { PlaceListContext } from "./place-list-provider.jsx";

function PlaceItemDeleteDialog({ item, onClose }) {
  const [errorState, setErrorState] = useState();
  const { state, handlerMap } = useContext(PlaceListContext);

  return (
    <Modal show={true} onHide={onClose} contentClassName="flavtam-modal-content">
      <Modal.Header closeButton>
        <Modal.Title>Smazat místo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState?.message ? (
          <Alert variant={"danger"}>{errorState.message}</Alert>
        ) : null}
        {`Opravdu chcete smazat místo „${item.name}"?`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          Zavřít
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={async () => {
            const result = await handlerMap.handleDelete({ id: item.id });
            if (result.ok) {
              onClose();
            } else {
              setErrorState(result.error);
            }
          }}
        >
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PlaceItemDeleteDialog;
