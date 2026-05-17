import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";

function Error({ message }) {
  return (
    <div className="flavtam-error">
      <Icon path={mdiAlertCircle} size={10} color="#ef4444" />
      <span className="flavtam-error-text">{message}</span>
    </div>
  );
}

export default Error;
