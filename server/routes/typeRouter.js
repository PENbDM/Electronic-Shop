import { Router } from "express";
import typeController from "../controllers/typeController.js";
const typeRouter = new Router();
import checkRole from "../middleware/CheckRoleMiddleware.js";

typeRouter.post("/", checkRole("ADMIN"), typeController.create);
typeRouter.get("/", typeController.getAll);

export default typeRouter;
