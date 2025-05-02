"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/rental-payment", (0, auth_1.default)("tenant"), order_controller_1.RentalControllers.makeRentalPayment);
//verify payment
router.get("/verify", (0, auth_1.default)("tenant"), order_controller_1.RentalControllers.rentalVerify);
//tenants can see their orders and payments through this route
router.get("/my-order", (0, auth_1.default)("tenant"), order_controller_1.RentalControllers.getTenantOrders);
router.get("/all-orders", (0, auth_1.default)("admin"), order_controller_1.RentalControllers.getAllRentalOrders);
router.delete("/cancel-order/:id", (0, auth_1.default)("tenant"), order_controller_1.RentalControllers.cancelRentalOrder);
exports.OrderRoutes = router;
