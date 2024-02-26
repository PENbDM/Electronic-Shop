import { Router } from "express";
const productRouter = new Router();
import producController from "../controllers/productController.js";
import checkRole from "../middleware/CheckRoleMiddleware.js";
import handleValidationsError from "../utils/handleValidationsError.js";
import { productValidation } from "../validations.js";

productRouter.post(
  "/",
  checkRole("ADMIN"),
  productValidation,
  handleValidationsError,
  producController.create
);
productRouter.get("/", producController.getAll);
productRouter.get("/:id", producController.getOne);

export default productRouter;
