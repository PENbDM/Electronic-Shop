// Modal.tsx
import React, { useState, useEffect } from "react";
import "./index.scss";
import { fetchLogin, fetchRegister } from "../../redux/slices/userSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, USER_ROUTE } from "../../utils/consts";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface ValidationErrors {
  [key: string]: string; // Represents field name and its corresponding error message
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [registrationError, setRegistrationError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (!isOpen) {
      setLoginEmail("");
      setLoginPassword("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setValidationErrors({});
      setRegistrationError("");
      setLoginError("");
    }
  }, [isOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await dispatch(
      fetchLogin({ email: loginEmail, password: loginPassword })
    );

    if (data.payload && data.payload?.userWithoutPassword?.role === "ADMIN") {
      console.log("Redirecting to admin page");
      navigate(ADMIN_ROUTE);
      onClose();
    }

    if (
      data.payload &&
      data.payload.token &&
      data.payload?.userWithoutPassword?.role === "USER"
    ) {
      // Handle successful login
      console.log("Redirecting to user page");
      navigate(USER_ROUTE);
      onClose();
    } else if (Array.isArray(data.payload)) {
      const newValidationErrors: ValidationErrors = {};
      data.payload.forEach((error) => {
        newValidationErrors[error.path] = error.msg;
      });
      setValidationErrors(newValidationErrors);
      setLoginError("");
    } else if (data.payload.message) {
      setLoginError(data.payload.message);
      setValidationErrors({});
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await dispatch(
        fetchRegister({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        })
      );

      if (data.payload.token) {
        console.log("Redirecting to user page");
        navigate(USER_ROUTE);
        onClose();
      } else if (Array.isArray(data.payload)) {
        const newValidationErrors: ValidationErrors = {};
        data.payload.forEach((error) => {
          newValidationErrors[error.path] = error.msg;
        });
        setValidationErrors(newValidationErrors);
        setRegistrationError("");
      } else if (data.payload.message) {
        setRegistrationError(data.payload.message);
        setValidationErrors({});
      }
    } catch (err) {
      console.log(err);
    }
  };
  const isAuth = useSelector(selectIsAuth);

  const switchTab = (newTab: string) => {
    setTab(newTab);
    setValidationErrors({});
    setRegistrationError("");
    setLoginError("");
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className={`tab ${tab === "login" ? "active" : ""}`}>
            <h2>Login</h2>
            <form className="formShiet">
              <label htmlFor="login-email">Email:</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="error-message">
                {validationErrors["email"] && (
                  <span>{validationErrors["email"]}</span>
                )}
                {loginError && <span>{loginError}</span>}
              </div>

              <label htmlFor="login-password">Password:</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <div className="error-message">
                {validationErrors["password"] && (
                  <span>{validationErrors["password"]}</span>
                )}
              </div>
              <div className="wrappp">
                <div className="centered-button">
                  <button type="button" onClick={handleLoginSubmit}>
                    Login
                  </button>
                </div>
                <p className="create-account-text">
                  No account?{" "}
                  <button
                    type="button"
                    className="create-account-button"
                    onClick={() => switchTab("register")}
                  >
                    Sign up
                  </button>
                </p>
                <div className="testDriveLogin">
                  <p>Test drive:</p>
                  <p>Email: test@gmail.com</p>
                  <p>Email: 12345User</p>
                </div>
              </div>
            </form>
          </div>
          <div className={`tab ${tab === "register" ? "active" : ""}`}>
            <h2>Register</h2>
            <form>
              <label htmlFor="register-name">Name:</label>
              <input
                type="text"
                id="register-name"
                name="name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
              <div className="error-message">
                {validationErrors["name"] && (
                  <span>{validationErrors["name"]}</span>
                )}
              </div>

              <label htmlFor="register-email">Email:</label>
              <input
                type="email"
                id="register-email"
                name="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <div className="error-message">
                {validationErrors["email"] && (
                  <span>{validationErrors["email"]}</span>
                )}
                {registrationError && <span>{registrationError}</span>}
              </div>

              <label htmlFor="register-password">Password:</label>
              <input
                type="password"
                id="register-password"
                name="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <div className="error-message">
                {validationErrors["password"] && (
                  <span>{validationErrors["password"]}</span>
                )}
              </div>
              <div className="wrappp">
                <div className="centered-button">
                  <button type="button" onClick={handleRegisterSubmit}>
                    Register{" "}
                  </button>
                </div>
                <p className="create-account-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="create-account-button"
                    onClick={() => switchTab("login")}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
