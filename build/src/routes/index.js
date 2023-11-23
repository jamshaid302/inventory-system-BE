"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
class CreatceRoutes {
    constructor() {
        this.routers = [];
        this.routers.push(user_1.default);
        // Add more routes as needed
    }
}
exports.default = CreatceRoutes;
