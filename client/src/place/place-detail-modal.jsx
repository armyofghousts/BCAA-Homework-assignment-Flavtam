import { useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Icon from "@mdi/react";
import { mdiClose, mdiMapMarker, mdiStar } from "@mdi/js";

function PlaceDetailModal({ place, categoryName, onClose, onEdit }) {
  const [lightboxSrc, setLightboxSrc] = useState();

  useEffect(() => {
    if (!lightboxSrc) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxSrc();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxSrc]);

  if (!place) {
    return null;
  }

  return (
    <>
      <Modal
        show={true}
        onHide={onClose}
        size="xl"
        centered
        contentClassName="flavtam-modal-content"
        dialogClassName="flavtam-modal-dialog--detail"
      >
        <Modal.Header closeButton>
          <Modal.Title>{place.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="place-detail-body">
          {place.images?.length > 0 ? (
            <div className="place-detail-images d-flex flex-wrap gap-2">
              {place.images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  className="place-detail-image-btn"
                  onClick={() => setLightboxSrc(src)}
                  aria-label={`Zvětšit fotku ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`${place.name} ${index + 1}`}
                    className="place-detail-image-thumb"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="place-detail-rating">
            <Icon path={mdiStar} size={0.9} color="#ffc107" />
            <span>{place.rating}</span>
          </div>

          <div className="place-detail-location">
            <Icon path={mdiMapMarker} size={0.9} className="place-detail-location-icon" />
            <span>{place.location?.trim() || "—"}</span>
          </div>

          <div className="place-detail-difficulty">
            <Badge bg="info">{place.difficulty}</Badge>
          </div>

          <section className="place-detail-section">
            <h3 className="place-detail-label">Popis</h3>
            <div className="place-detail-description-box">
              {place.description?.trim() || "—"}
            </div>
          </section>

          {categoryName ? (
            <div className="place-detail-tags">
              <Badge bg="secondary">{categoryName}</Badge>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Zavřít
          </Button>
          <Button variant="primary" onClick={() => onEdit(place)}>
            Upravit
          </Button>
        </Modal.Footer>
      </Modal>

      {lightboxSrc ? (
        <div
          className="place-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Zvětšená fotka"
          onClick={() => setLightboxSrc()}
        >
          <button
            type="button"
            className="place-lightbox-close"
            aria-label="Zavřít"
            onClick={() => setLightboxSrc()}
          >
            <Icon path={mdiClose} size={1.2} />
          </button>
          <img
            src={lightboxSrc}
            alt={place.name}
            className="place-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

export default PlaceDetailModal;
