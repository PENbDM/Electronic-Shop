import { Router } from "express";
const brandRouter = new Router();
import brandController from "../controllers/brandController.js";
import checkRole from "../middleware/CheckRoleMiddleware.js";

brandRouter.post("/", checkRole("ADMIN"), brandController.create);
brandRouter.get("/", brandController.getAll);

export default brandRouter;
