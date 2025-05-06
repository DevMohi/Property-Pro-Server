import express from "express";
import auth from "../../middlewares/auth";
import { RentalTransactionControllers } from "./order.controller";

const router = express.Router();

// Tenant initiates a rental payment
router.post(
  "/rental-payment",
  auth("tenant"),
  RentalTransactionControllers.makeRentalPayment
);

//verify payment
router.get(
  "/verify",
  auth("tenant"),
  RentalTransactionControllers.paymentVerify // ← should point to rentalVerify
);

// Tenant views their rental payment history
router.get(
  "/my-orders",
  auth("tenant"),
  RentalTransactionControllers.getTenantOrders
);

// Admin: view all transactions
router.get(
  "/all-orders",
  auth("admin"),
  RentalTransactionControllers.getAllRentalOrders
);

// Optional: cancel a rental order (not used in service yet)
router.delete(
  "/cancel-order/:transactionId",
  auth("tenant"),
  RentalTransactionControllers.cancelRentalOrder // or create a `cancelTransaction` method
);

export const OrderRoutes = router;
