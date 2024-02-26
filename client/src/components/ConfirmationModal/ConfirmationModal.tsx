import React from "react";
import "./index.scss";
interface ModalAddCartProps {
  onClose: () => void;
}

const ConfirmationModal: React.FC<ModalAddCartProps> = ({ onClose }) => {
  return (
    <div className="login-modal">
      <p>Everything worked out, go to the product page to check !</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ConfirmationModal;
