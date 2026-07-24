import { CheckCircle, XCircle, X } from "lucide-react";
import "../styles/toast.css";

function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle size={21} />
        ) : (
          <XCircle size={21} />
        )}
      </div>

      <span>{message}</span>

      <button type="button" onClick={onClose} className="toast-close">
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;