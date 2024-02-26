import { Orders, Product, User, Order_Product } from "../models/models.js";
const calculateTotalPrice = (products) => {
  if (!Array.isArray(products)) {
    throw new Error("Invalid products array");
  }

  return products.reduce((total, product) => total + (product.price || 0), 0);
};

class OrderController {
  async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { cartItems } = req.body;
      let totalQuantity = cartItems.reduce(
        (total, item) => total + item.cart_product.quantity,
        0
      );
      let totalprice = 0; // Initialize totalprice here

      const order = await Orders.create({
        totalquantity: totalQuantity,
        totalprice: 0, // Initialize totalprice with 0
        orderdate: new Date(),
      });

      await order.setUser(userId);

      for (const cartItem of cartItems) {
        const quantity = cartItem.cart_product.quantity;

        const product = await Product.findByPk(cartItem.id);

        if (product) {
          totalprice += quantity * product.price;

          // Associate products with the order
          await Order_Product.create({
            orderId: order.id,
            productId: product.id,
            quantity: quantity,
            price: product.price,
          });
        }
      }

      // Update order with calculated values
      await order.update({
        totalquantity: totalQuantity,
        totalprice: totalprice,
      });

      console.log("Order created successfully:", order);
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Error creating order" });
    }
  }

  async getOrders(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      const orders = await user.getOrders({
        include: [{ model: Product, through: Order_Product }],
      });
      res.status(201).json(orders);
    } catch (error) {
      console.error(error);
      throw new Error("Error getting orders");
    }
  }
}

export default new OrderController();
