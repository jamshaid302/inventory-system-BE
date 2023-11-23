import express from "express";
import userRoutes from "./user";
import buyerRoutes from "./buyers";
import productRoutes from "./products";
import purchasesRoutes from "./purchases";

class CreatceRoutes {
  public routers: express.Router[] = [];

  constructor() {
    this.routers.push(express.Router().use("/user", userRoutes));
    this.routers.push(express.Router().use("/buyer", buyerRoutes));
    this.routers.push(express.Router().use("/product", productRoutes));
    this.routers.push(express.Router().use("/purchases", purchasesRoutes));
    // Add more routes as needed
  }
}

export default CreatceRoutes;
