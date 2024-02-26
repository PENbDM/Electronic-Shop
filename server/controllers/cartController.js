// cartController.js
// cartController.js
import { Cart, Cart_Product, Product } from "../models/models.js";

class CartController {
  async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;
      console.log(req.user);
      // Check if the product with the given ID exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if the user has a cart
      let cart = await Cart.findOne({ where: { userId: userId } });

      // If the user doesn't have a cart, create a new one
      if (!cart) {
        cart = await Cart.create({ userId: userId });
      }

      // Add the product to the cart
      await Cart_Product.create({
        cartId: cart.id,
        productId: productId,
      });

      // Update the cart to associate it with the new product
      cart = await Cart.findOne({
        where: { id: cart.id },
        include: [{ model: Product, as: "products" }],
      });

      return res.status(200).json({
        message: "Product added to the cart successfully",
        cart: cart,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCartItems(req, res) {
    try {
      const userId = req.user.id;

      // Find the user's cart based on userId
      const cart = await Cart.findOne({
        where: { userId: userId },
        include: [{ model: Product, as: "products" }],
      });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      return res.status(200).json(cart.products);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteCartItem(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;
      // Find the user's cart
      const cart = await Cart.findOne({ where: { userId: userId } });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Remove the product from the cart
      await Cart_Product.destroy({
        where: { cartId: cart.id, productId: productId },
      });

      // Update the cart to reflect the removal
      const updatedCart = await Cart.findOne({
        where: { id: cart.id },
        include: [{ model: Product, as: "products" }],
      });

      return res.status(200).json({
        message: "Product removed from the cart successfully",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateCartItemQuantity(req, res) {
    try {
      const { id, quantityAdjustment } = req.body;
      const userId = req.user.id;

      // Find the user's cart
      const cart = await Cart.findOne({ where: { userId: userId } });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Find the cart item to update
      const cartProduct = await Cart_Product.findOne({
        where: { cartId: cart.id, productId: id },
      });

      if (!cartProduct) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Update the quantity
      cartProduct.quantity += quantityAdjustment;
      await cartProduct.save();

      // Update the cart to reflect the changes
      const updatedCart = await Cart.findOne({
        where: { id: cart.id },
        include: [{ model: Product, as: "products" }],
      });

      return res.status(200).json({
        message: "Product quantity updated successfully",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error updating product quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async clearCart(req, res) {
    try {
      const userId = req.user.id;
      // Find the user's cart
      const cart = await Cart.findOne({ where: { userId: userId } });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Remove all products from the cart
      await Cart_Product.destroy({
        where: { cartId: cart.id },
      });

      // Update the cart to reflect the removal
      const updatedCart = await Cart.findOne({
        where: { id: cart.id },
        include: [{ model: Product, as: "products" }],
      });

      return res.status(200).json({
        message: "All products removed from the cart successfully",
        cart: updatedCart,
      });
    } catch (error) {
      console.error("Error deleting products from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new CartController();
