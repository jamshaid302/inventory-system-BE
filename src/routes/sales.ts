import { Router } from "express";
import SalesController from "../controllers/sales";
import { authentication } from "../middlewares";

const salesRoutes: Router = Router();
const controller = new SalesController();

salesRoutes.post("/", authentication, controller.createSales);

export default salesRoutes;
