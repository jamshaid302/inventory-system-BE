import { Router } from "express";
import UserController from "../controllers/user";

const userRoutes: Router = Router();
const controller = new UserController();

userRoutes.post("/add", controller.createUser);
userRoutes.post("/login", controller.login);

export default userRoutes;
