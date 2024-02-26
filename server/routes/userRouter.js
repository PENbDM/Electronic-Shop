import { Router } from "express";
const userRouter = new Router();
import userController from "../controllers/userController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import handleValidationsError from "../utils/handleValidationsError.js";
import { loginValidation, registerValidation } from "../validations.js";

userRouter.post(
  "/registration",
  registerValidation,
  handleValidationsError,
  userController.registration
);
userRouter.post(
  "/login",
  loginValidation,
  handleValidationsError,
  userController.login
);
userRouter.get("/auth", AuthMiddleware, userController.check);

export default userRouter;
