import { Router } from "express";
import { authentication } from "../middlewares";
import PurchasesController from "../controllers/purchases";

const purchasesRoutes: Router = Router();
const controller = new PurchasesController();

purchasesRoutes.get("/", authentication, controller.getAllPurchases);
purchasesRoutes.get(
  "/get-total-purchases-amount",
  controller.getTotalPurchasesAmount,
);

export default purchasesRoutes;
