"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
// Tenant initiates a rental payment
router.post("/rental-payment", (0, auth_1.default)("tenant"), order_controller_1.RentalTransactionControllers.makeRentalPayment);
//verify payment
router.get("/verify", (0, auth_1.default)("tenant"), order_controller_1.RentalTransactionControllers.paymentVerify // ← should point to rentalVerify
);
// Tenant views their rental payment history
router.get("/my-orders", (0, auth_1.default)("tenant"), order_controller_1.RentalTransactionControllers.getTenantOrders);
// Admin: view all transactions
router.get("/all-orders", (0, auth_1.default)("admin"), order_controller_1.RentalTransactionControllers.getAllRentalOrders);
// Optional: cancel a rental order (not used in service yet)
router.delete("/cancel-order/:transactionId", (0, auth_1.default)("tenant"), order_controller_1.RentalTransactionControllers.cancelRentalOrder // or create a `cancelTransaction` method
);
exports.OrderRoutes = router;
