"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const userRoutes = (0, express_1.Router)();
const controller = new user_1.default();
userRoutes.post("/add", controller.createUser);
exports.default = userRoutes;
