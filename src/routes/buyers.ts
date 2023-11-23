import { Router } from "express";
import BuyerController from "../controllers/buyers";
import { authentication } from "../middlewares";

const buyerRoutes: Router = Router();
const controller = new BuyerController();

buyerRoutes.post("/", authentication, controller.createBuyer);
buyerRoutes.get("/", authentication, controller.getAllBuyers);
buyerRoutes.patch("/:id", authentication, controller.updateBuyer);
buyerRoutes.delete("/:id", authentication, controller.deleteBuyer);

export default buyerRoutes;
