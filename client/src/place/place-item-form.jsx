import { useContext, useRef, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";

import Icon from "@mdi/react";
import { mdiStar, mdiStarOutline } from "@mdi/js";

import { PlaceListContext } from "./place-list-provider.jsx";

const difficultyOptions = ["easy", "medium", "hard", "very hard", "unknown"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

function isAllowedImage(file) {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();
  return (
    ALLOWED_EXTENSIONS.includes(extension) &&
    ALLOWED_IMAGE_TYPES.includes(file.type)
  );
}

const MAX_IMAGE_WIDTH = 1600;
const JPEG_QUALITY = 0.82;

function compressImageForUpload(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = image;
      if (width > MAX_IMAGE_WIDTH) {
        height = Math.round((height * MAX_IMAGE_WIDTH) / width);
        width = MAX_IMAGE_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(outputType, JPEG_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Nepodařilo se zpracovat obrázek."));
    };

    image.src = objectUrl;
  });
}

function StarRating({ value, onChange, disabled }) {
  return (
    <div
      role="group"
      aria-label="Hodnocení"
      className="d-flex gap-1"
      style={{ userSelect: "none" }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            aria-label={`Hodnocení ${star} z 5`}
            className="border-0 bg-transparent p-0"
            style={{
              lineHeight: 0,
              cursor: disabled ? "default" : "pointer",
            }}
          >
            <Icon
              path={filled ? mdiStar : mdiStarOutline}
              size={1.5}
              color={filled ? "#ffc107" : "#ced4da"}
            />
          </button>
        );
      })}
    </div>
  );
}

function PlaceItemForm({ item, onClose }) {
  const { state, data, error, handlerMap } = useContext(PlaceListContext);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(item?.images ?? []);
  const [fileError, setFileError] = useState();
  const [rating, setRating] = useState(item?.rating ?? 1);

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    const invalid = files.filter((file) => !isAllowedImage(file));
    if (invalid.length) {
      setFileError("Povolené formáty: JPG, JPEG, PNG.");
      return;
    }

    setFileError();
    setSelectedFiles((current) => [...current, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((current) => current.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((current) => current.filter((_, i) => i !== index));
  };

  return (
    <Modal show={true} onHide={onClose} contentClassName="flavtam-modal-light">
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);
          values.rating = rating;

          let newImages;
          try {
            newImages = await Promise.all(
              selectedFiles.map((file) => compressImageForUpload(file))
            );
          } catch {
            setFileError("Nepodařilo se zpracovat jeden z obrázků.");
            return;
          }
          values.images = [...existingImages, ...newImages];

          let result;
          if (item?.id) {
            result = await handlerMap.handleUpdate({
              id: item.id,
              ...values,
            });
          } else {
            result = await handlerMap.handleCreate({ ...values });
          }
          if (result.ok) {
            onClose({ created: !item?.id });
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item?.id ? "Upravit" : "Přidat"} místo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {state === "error" ? (
            <Alert variant={"danger"}>{error?.message}</Alert>
          ) : null}
          {fileError ? <Alert variant="warning">{fileError}</Alert> : null}
          <Form.Label>Název</Form.Label>
          <Form.Control
            type="text"
            name="name"
            defaultValue={item?.name}
            disabled={state === "pending"}
            required
          />
          <Form.Label>Popis</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={6}
            className="w-100"
            style={{ minHeight: "140px", resize: "none" }}
            defaultValue={item?.description}
            disabled={state === "pending"}
          />
          <Form.Label>Lokace</Form.Label>
          <Form.Control
            type="text"
            name="location"
            defaultValue={item?.location}
            disabled={state === "pending"}
          />
          <Form.Label>Obtížnost</Form.Label>
          <Form.Select
            name="difficulty"
            defaultValue={item?.difficulty ?? "easy"}
            disabled={state === "pending"}
            required
          >
            {difficultyOptions.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </Form.Select>
          <Form.Label>Hodnocení</Form.Label>
          <StarRating
            value={rating}
            onChange={setRating}
            disabled={state === "pending"}
          />
          <Form.Label>Kategorie</Form.Label>
          <Form.Select
            name="categoryId"
            defaultValue={item?.categoryId}
            disabled={state === "pending"}
            required
          >
            {data?.categoryMap
              ? Object.keys(data.categoryMap).map((categoryId) => {
                  return (
                    <option key={categoryId} value={categoryId}>
                      {data.categoryMap[categoryId].name}
                    </option>
                  );
                })
              : null}
          </Form.Select>

          <Form.Label className="mt-3">Fotky</Form.Label>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="d-none"
              disabled={state === "pending"}
              onChange={handleFilesSelected}
            />
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              disabled={state === "pending"}
              onClick={() => fileInputRef.current?.click()}
            >
              Přidat soubory
            </Button>
            <Form.Text className="text-muted mb-0">
              JPG, JPEG, PNG
            </Form.Text>
          </div>

          {existingImages.length > 0 ? (
            <ListGroup className="mb-2">
              {existingImages.map((src, index) => (
                <ListGroup.Item
                  key={`existing-${index}`}
                  className="d-flex align-items-center gap-2"
                >
                  <img
                    src={src}
                    alt={`Fotka ${index + 1}`}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <span className="flex-grow-1 text-truncate">
                    Uložená fotka {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    disabled={state === "pending"}
                    onClick={() => removeExistingImage(index)}
                  >
                    Odebrat
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : null}

          {selectedFiles.length > 0 ? (
            <ListGroup>
              {selectedFiles.map((file, index) => (
                <ListGroup.Item
                  key={`${file.name}-${index}`}
                  className="d-flex align-items-center justify-content-between"
                >
                  <span className="text-truncate me-2">{file.name}</span>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    disabled={state === "pending"}
                    onClick={() => removeSelectedFile(index)}
                  >
                    Odebrat
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : null}
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
            variant="primary"
            type="submit"
            disabled={state === "pending"}
          >
            Uložit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PlaceItemForm;
