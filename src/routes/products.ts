import { Router } from "express";
import { authentication } from "../middlewares";
import ProductsController from "../controllers/products";

const productRoutes: Router = Router();
const controller = new ProductsController();

productRoutes.post("/", authentication, controller.createProduct);
productRoutes.get("/", authentication, controller.getAllProducts);
productRoutes.patch("/:id", authentication, controller.updateProduct);
productRoutes.delete("/:id", authentication, controller.deleteProduct);
productRoutes.get("/get-buyers", authentication, controller.getAllBuyers);

export default productRoutes;
