import express from "express";
import { RentalControllers } from "./order.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/rental-payment",
  auth("tenant"),
  RentalControllers.makeRentalPayment
);

//verify payment
router.get("/verify", auth("tenant"), RentalControllers.rentalVerify);

//tenants can see their orders and payments through this route
router.get("/my-order", auth("tenant"), RentalControllers.getTenantOrders);

router.get("/all-orders", auth("admin"), RentalControllers.getAllRentalOrders);

router.delete(
  "/cancel-order/:id",
  auth("tenant"),
  RentalControllers.cancelRentalOrder
);

export const OrderRoutes = router;
