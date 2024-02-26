import React, { useEffect, useState } from "react";
import "./index.scss";
import logo from "../../../src/img/logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Modal from "../Modal/Modal";
import LoginModal from "../ModalCart/LoginModal";
import { fetchAllItemsCart } from "../../redux/slices/cartSlice";
import {
  HOME_ROUTE,
  USER_ROUTE,
  CART_ROUTE,
  ADMIN_ROUTE,
} from "../../utils/consts";

interface CartProduct {
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  cartId: number;
  productId: number;
}

interface CartItem {
  id: number;
  productId: number;
  price: number;

  img: string;
  name: string;
  cart_product: CartProduct;
}

function Header() {
  const dispatch: AppDispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const user = useSelector((state: RootState) => state.user);
  const [freshCartItems, setFreshCartItems] = useState<CartItem[]>([]); // Explicitly specify the type

  const fetchCart = async () => {
    try {
      const res = await dispatch(fetchAllItemsCart());
      // Ensure that res.payload is of type CartItem[]
      setFreshCartItems(res.payload as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  useEffect(() => {
    if (user?.isAuth === true && user?.user?.userWithoutPassword?.email) {
      const userEmail = user.user.userWithoutPassword.email;
      const firstLetter = userEmail[0];

      setNameUser(firstLetter.toUpperCase());
    }
  }, [user?.isAuth, user?.user?.userWithoutPassword?.email]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleCartClick = () => {
    if (user?.isAuth) {
      navigate(CART_ROUTE);
    } else {
      toggleLoginModal();
    }
  };
  const handleUserClick = () => {
    if (user?.isAuth) {
      const userRole = user.user.userWithoutPassword.role;
      if (userRole === "ADMIN") {
        navigate(ADMIN_ROUTE);
      } else {
        navigate(USER_ROUTE);
      }
    } else {
      toggleLoginModal();
    }
  };
  return (
    <header>
      <div className="wrappper">
        <div className="leftHeader">
          <NavLink to={HOME_ROUTE}>
            <img src={logo} alt="logo" width={50} height={50} />
          </NavLink>
          <p className="logoName">POWER SHOP</p>
        </div>

        <div className="rightHeader">
          <div className="accountUser">
            {user?.isAuth && nameUser && (
              <div className="userCircle" onClick={handleUserClick}>
                {nameUser}
              </div>
            )}
            {!user?.isAuth && (
              <button onClick={toggleModal} style={{ all: "unset" }}>
                <AccountCircleIcon
                  className="AccountCircleIcon"
                  style={{ width: "44px", height: "44px" }}
                />
              </button>
            )}
          </div>
          {user?.isAuth &&
          user.user.userWithoutPassword?.role === "ADMIN" ? null : (
            <div className="CartDiv" onClick={handleCartClick}>
              {cartItems.length !== 0 ? (
                <div className="headerCart">
                  <ShoppingCartIcon
                    className="ShoppingCartIcon"
                    style={{ width: "44px", height: "44px" }}
                  />
                  <p className="headerCartLength">{cartItems.length}</p>
                </div>
              ) : (
                <ShoppingCartIcon
                  className="ShoppingCartIcon"
                  style={{ width: "44px", height: "44px" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
      {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} />}
    </header>
  );
}

export default Header;
