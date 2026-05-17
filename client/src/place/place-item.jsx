import Button from "react-bootstrap/Button";
import Icon from "@mdi/react";
import {
  mdiChevronRight,
  mdiDeleteOutline,
  mdiImageOutline,
  mdiMapMarker,
  mdiStar,
} from "@mdi/js";

function PlaceItem({
  item,
  categoryName,
  onOpenDetail,
  onDelete,
}) {
  const thumbnail = item.images?.[0];

  return (
    <article className="place-card">
      <div className="place-card-image">
        {thumbnail ? (
          <img src={thumbnail} alt={item.name} />
        ) : (
          <Icon path={mdiImageOutline} size={2.2} color="#adb5bd" />
        )}
      </div>

      <div className="place-card-body">
        <div className="place-card-title-row">
          <h2 className="place-card-title">{item.name}</h2>
          {categoryName ? (
            <span className="place-card-category">{categoryName}</span>
          ) : null}
        </div>
        <p className="place-card-description">
          {item.description?.trim() ||
            "Krátký popis místa, který vystihuje jeho hlavní charakteristiky."}
        </p>
        <div className="place-card-meta">
          <span>
            <Icon path={mdiStar} size={0.85} color="#ffc107" />
            {item.rating ?? "—"}
          </span>
          <span>
            <Icon path={mdiMapMarker} size={0.85} color="#6c757d" />
            {item.location?.trim() || "Lokalita"}
          </span>
        </div>
      </div>

      <div className="place-card-actions">
        <Button
          variant="outline-secondary"
          className="btn-detail"
          onClick={() => onOpenDetail(item)}
        >
          Otevřít detail
          <Icon path={mdiChevronRight} size={0.9} />
        </Button>
        <Button
          variant="outline-danger"
          className="btn-delete"
          aria-label="Smazat místo"
          onClick={() => onDelete(item)}
        >
          <Icon path={mdiDeleteOutline} size={1} />
        </Button>
      </div>
    </article>
  );
}

export default PlaceItem;
