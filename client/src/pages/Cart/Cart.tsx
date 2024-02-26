import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItemsCart } from "../../redux/slices/cartSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { deleteCartItem } from "../../redux/slices/cartSlice";
import delivery from "../../img/delivery.png";
import { updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import stock from "../../img/storage.png";
import cartEmpty from "../../img/empty_basket.png";
import { Link } from "react-router-dom";
import { createOrder } from "../../redux/slices/orderSlice";
import "./index.scss";
import StripeContainer from "../../components/StripePayment/StripePayment";
import { useNavigate } from "react-router-dom";
import { ORDERS_ROUTE } from "../../utils/consts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  cart_product: CartProduct; // Add cart_product field
  // Add other necessary fields
}

const Cart = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [redirectToOrders, setRedirectToOrders] = useState(false);

  const { cartItems, status } = useSelector((state: RootState) => state.cart);
  const user = useSelector(
    (state: RootState) => state.user.user.userWithoutPassword
  );
  const [freshCartItems, setFreshCartItems] = useState<CartItem[]>([]);
  console.log(freshCartItems);
  const [success, setSuccess] = useState(false);
  const prevSuccessRef = useRef(success);
  const fetchCart = async () => {
    try {
      const res = await dispatch(fetchAllItemsCart());
      setFreshCartItems(res.payload as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const notify = () => {
    toast.info("Order placed successfully! Redirecting to orders page...", {
      autoClose: 4000, // 5 seconds
      position: "top-center", // Corrected
    });
  };

  useEffect(() => {
    // Move the useEffect to the top level
    if (success === true && prevSuccessRef.current === false) {
      prevSuccessRef.current = success;
      notify(); // Show notification

      const timeoutId = setTimeout(() => {
        console.log("got success, timeout");

        // Additional timeout for setRedirectToOrders(true)
        const redirectToOrdersTimeoutId = setTimeout(() => {
          setRedirectToOrders(true);
        }, 1000); // Adjust the duration as needed

        handleOrderClick(freshCartItems);

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(redirectToOrdersTimeoutId); // Clear the additional timeout
        };
      }, 4000);

      return () => clearTimeout(timeoutId);
    }

    prevSuccessRef.current = success;
  }, [success, freshCartItems]);

  useEffect(() => {
    // Fetch the cart items when the component mounts
    fetchCart();
  }, []); // Empty dependency array to run only on mount
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  console.log(freshCartItems);

  if (status === "failed") {
    return <div>Error fetching cart items</div>;
  }

  const handleQuantityChange = async (
    id: number,
    quantityAdjustment: number
  ) => {
    try {
      await dispatch(updateCartItemQuantity({ id, quantityAdjustment }));
      setFreshCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            const updatedItem = {
              ...item,
              cart_product: {
                ...item.cart_product,
                quantity: item.cart_product.quantity + quantityAdjustment,
              },
            };

            if (
              quantityAdjustment < 0 &&
              updatedItem.cart_product.quantity === 0
            ) {
              handleDeleteItemFromCart(id);
            }

            return updatedItem;
          }

          return item;
        })
      );
      await fetchCart(); // Fetch the updated cart first
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteItemFromCart = async (id: number) => {
    await dispatch(deleteCartItem(id));
    await fetchCart();
  };
  const calculateTotalPrice = () => {
    return freshCartItems.reduce(
      (total, item) => total + item.cart_product.quantity * item.price,
      0
    );
  };

  console.log(success, "success nice");

  const handleOrderClick = async (freshCartItems: CartItem[]) => {
    try {
      // Extract product data from freshCartItems
      const products: Record<string, number> = {};
      freshCartItems.forEach((item) => {
        products[item.id.toString()] = item.cart_product.quantity;
      });

      // Ensure the user is available
      if (!user) {
        console.error("User not available");
        return;
      }

      // Dispatch createOrder with userId and products
      await dispatch(createOrder({ cartItems }));
      await dispatch(clearCart());
      await fetchCart();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="cartBlock">
      <ToastContainer />
      <>{redirectToOrders && navigate(ORDERS_ROUTE)}</>
      <p className="YouRCart">Your basket ({freshCartItems.length} item)</p>
      {freshCartItems.length === 0 ? (
        <div className="wrapperCartt">
          <div className="blockCartIsEmpty">
            <p className="textEmptyCart">Your cart is empty</p>
            <img src={cartEmpty} width={200} height={200} />
            <Link to="/">
              <button className="btn-come-back-home">
                Come back Home Page
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="wrapperCart">
          <div className="cartLeft">
            {freshCartItems.map((item) => (
              <div className="blockOfCartProduct">
                <div className="cartBlockImg">
                  <img src={item.img} />
                </div>
                <div className="cartBlockDesc">
                  <h3 className="cartItemName">{item.name}</h3>
                  <div className="BlockSomeCART">
                    <div className="blockQuantity">
                      <p className="QunatityBlock">
                        Quantity: {item.cart_product.quantity}
                      </p>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="btn-add-remove"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="btn-add-remove"
                      >
                        -
                      </button>
                    </div>
                    <div className="blockREmove">
                      <button
                        onClick={() => handleDeleteItemFromCart(item.id)}
                        className="btn-add-removeee"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="blockPrice">
                      <p>
                        £{(item.cart_product.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="someDeliveryInfo">
                    <p style={{ marginBottom: "10px", font: "40px" }}>
                      You can choose your delivery or collection preferences at
                      checkout
                    </p>
                    <div className="blockofDelivery">
                      <img src={delivery} width={20} height={20} />
                      <p>Delivery available</p>
                    </div>
                    <div className="blockofStock">
                      <img src={stock} width={20} height={20} />
                      <p>Free collection (subject to availability)</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cartRight">
            <div className="PaymentBlock">
              <p className="totalPriceBlockkkk">
                Total price: £{calculateTotalPrice().toFixed(2)}
              </p>

              <StripeContainer
                setSuccess={setSuccess} // Pass setSuccess as a prop
                totalPrice={calculateTotalPrice()}
                products={freshCartItems}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
