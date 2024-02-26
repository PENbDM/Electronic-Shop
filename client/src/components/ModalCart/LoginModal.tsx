import React from "react";
import "./index.scss";
interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="login-modal">
      <p>You need to be logged in to access the cart. Please log in.</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LoginModal;
