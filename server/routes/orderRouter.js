import { Router } from "express";
const orderRouter = new Router();
import orderController from "../controllers/orderController.js";
import checkRole from "../middleware/CheckRoleMiddleware.js";
orderRouter.post("/", checkRole("USER"), orderController.createOrder);
orderRouter.get("/", checkRole("USER"), orderController.getOrders);

export default orderRouter;
