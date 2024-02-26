// ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./index.scss";
import emptyHeart from "../../img/heartEmpty.png";
import Heart from "../../img/heart.png";
import security from "../../img/security.png";
import wallet from "../../img/wallet.png";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import LoginModal from "../../components/ModalCart/LoginModal";
import ModalAddCart from "../../components/ModalAddIntoCart/ModalAddCart";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { fetchAllItemsCart } from "../../redux/slices/cartSlice";
import FullScreenLoader from "../../components/ReactSkeletonFull/SkeletonFull";
interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  img: string;
  createdAt: string;
  updatedAt: string;
  typeOfProductId: number;
  brandId: number;
  description: ProductDescription[];
  brand: {
    name: string;
  };
  typeOfProduct: {
    name: string;
  };
}

interface ProductDescription {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  productId: number;
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalAddCartOpen, setIsModalAddCartOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const role = user?.user?.userWithoutPassword?.role || null;
  const { cartItems, status } = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);
  console.log(product);

  if (!product) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    );
  }
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const toggleAddItemCart = () => {
    setIsModalAddCartOpen(!isModalAddCartOpen);
  };
  const handleCartClick = async (id: number) => {
    if (user.user.token) {
      try {
        const existingCartItem = cartItems.find((item) => item.id === id);
        console.log(existingCartItem);

        if (existingCartItem) {
          await dispatch(
            updateCartItemQuantity({
              id,
              quantityAdjustment: 1,
            }) as any
          );

          console.log(cartItems);
        } else {
          await dispatch(addToCart({ productId: id }) as any);
        }

        // Dispatch fetchAllItemsCart and wait for it to complete
        await dispatch(fetchAllItemsCart() as any);
        // Log the updated cartItems
        console.log(cartItems);
        toggleAddItemCart();
      } catch (error) {
        console.error("Error handling cart click:", error);
      }
    } else {
      toggleLoginModal();
    }
  };

  return (
    <div className="wrapperrs">
      <div className="wrap">
        <div className="leftSidee">
          <div className="imgBlockk">
            <img src={product.img} alt={product.name} />
          </div>
        </div>
        <div className="rightSide">
          <div className="productInfo">
            <h1>{product.name}</h1>
          </div>
          {role === "ADMIN" ? (
            <div className="makeOrderBlock2">
              <p className="productPrice">£{product.price}</p>
            </div>
          ) : (
            <div className="makeOrderBlock">
              <p className="productPrice">£{product.price}</p>
              <div
                className="makeOrderButton"
                onClick={() => handleCartClick(product.id)}
              >
                <ShoppingCartIcon className="ShoppingCartIcon" />
                <button className="btn-trash">Buy</button>
              </div>
            </div>
          )}
          <div className="bullshit">
            <div className="payment">
              <img src={wallet} width={20} height={20} />
              <p>
                {" "}
                <span className="bold">Payment.</span> Payment upon receipt of
                the goods.
              </p>
            </div>
            <div className="garanty">
              <img src={security} width={20} height={20} />
              <p>
                <span className="bold"> Warranty.</span> 12 months.
                Exchange/return of goods within 14 days.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="description">
        <h2>Description</h2>
        <div className="desc">
          {product.description.map((data) => (
            <li key={data.id}>
              <strong>{data.title}:</strong> {data.description}
            </li>
          ))}
        </div>
      </div>
      {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} />}
      {isModalAddCartOpen && <ModalAddCart onClose={toggleAddItemCart} />}
    </div>
  );
}

export default ProductPage;
