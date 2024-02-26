import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../redux/slices/userSlice";
import "./index.scss";
import { RootState } from "../../redux/store";
import orderDone from "../../img/order_done.png";
import { fetchUserOrders } from "../../redux/slices/orderSlice";
import UserBlock from "./UserBlock";
import { NavLink } from "react-router-dom";
import { PRODUCT_ROUTE } from "../../utils/consts";
interface Order {
  id: number;
  totalquantity: number;
  totalprice: number;
  orderdate: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  img: string;
  typeOfProductId: number;
  brandId: number;
  order_product?: {
    id: number;
    quantity: number;
    price: number;
    orderId: number;
    productId: number;
  };
}

function Orders() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.user.user.userWithoutPassword
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const handleGetOrders = async () => {
    try {
      const actionResult = await (dispatch as any)(fetchUserOrders());

      if (fetchUserOrders.fulfilled.match(actionResult)) {
        const orders = actionResult.payload;
        setOrders(orders);
      } else {
        // Handle error if needed
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const handleCloseOrderDetails = async (shouldClose = false) => {
    await setIsOrderDetailsOpen(shouldClose);
    await setSelectedOrder(null);
  };

  return (
    <div className="userWrapper">
      <UserBlock user={user} handleLogout={handleLogout} />
      <div className="OrdersBlock">
        {Array.isArray(orders) && orders.length !== 0 ? (
          orders.map((order, index) => (
            <div
              key={order.id}
              className="orderSingle"
              onClick={() => handleOrderClick(order)}
            >
              <div className="divImgDataOrder">
                <div className="divNiceImg">
                  <img
                    src={orderDone}
                    width={100}
                    height={100}
                    alt="Order Done"
                  />
                </div>
                <div className="orderInside">
                  <p>
                    Order number: <span>{index + 1}</span>
                  </p>
                  <p>
                    Total Quantity: <span>{order.totalquantity}</span>
                  </p>
                  <p>
                    Total Price: <span>{order.totalprice}</span>
                  </p>
                  <p>
                    Order Date: <span>{order.orderdate}</span>
                  </p>
                </div>
              </div>
              {isOrderDetailsOpen && selectedOrder === order && (
                <div className="OrderDetails">
                  <div className="orderBlockClose">
                    <h2>Order Details</h2>
                    <button
                      className="btn-user"
                      onClick={() => handleCloseOrderDetails(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="products">
                    {order.products.map((product) => (
                      <NavLink
                        style={{ textDecoration: "none", color: "inherit" }}
                        key={product.id}
                        to={`${PRODUCT_ROUTE}/${product.id}`}
                        className="product"
                      >
                        <div className="productInfo">
                          <img
                            src={product.img}
                            width={50}
                            height={50}
                            alt="Product"
                          />
                        </div>
                        <div className="productInfo2">
                          <p>Name: {product.name}</p>
                          <p>Price: {product.price}</p>
                          <p>Quantity: {product.order_product?.quantity}</p>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>You don't have orders</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
