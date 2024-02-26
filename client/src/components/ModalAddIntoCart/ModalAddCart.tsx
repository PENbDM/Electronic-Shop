import React from "react";
import "./index.scss";
interface ModalAddCartProps {
  onClose: () => void;
}

const ModalAddCart: React.FC<ModalAddCartProps> = ({ onClose }) => {
  return (
    <div className="login-modal">
      <p>You added product into cart!</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ModalAddCart;
