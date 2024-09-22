import { Router } from "express";
import SalesController from "../controllers/sales";
import { authentication } from "../middlewares";

const salesRoutes: Router = Router();
const controller = new SalesController();

salesRoutes.get("/", authentication, controller.getAllInvoices);
salesRoutes.get("/sales-total", authentication, controller.getTotalSale);
salesRoutes.post("/", authentication, controller.createSales);
salesRoutes.post("/update", authentication, controller.updateSales);

export default salesRoutes;
