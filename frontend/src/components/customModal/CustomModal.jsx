










import { useEffect } from "react";
import "./customModal.css";

const CustomModal = ({ show, onClose, children }) => {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (show) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // prevent scroll
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomModal;