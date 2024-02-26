import React from "react";
import "./index.scss";
interface ModalAddCartProps {
  onClose: () => void;
}

const ConfirmationModal: React.FC<ModalAddCartProps> = ({ onClose }) => {
  return (
    <div className="login-modal">
      <p>Brand has been added !</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ConfirmationModal;
