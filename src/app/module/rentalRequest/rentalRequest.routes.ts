import express from "express";

import auth from "../../middlewares/auth";
import { RentalRequestController } from "./rentalRequest.controller";

const router = express.Router();

// Create a rental request (tenant only)
router.post("/", auth("tenant"), RentalRequestController.createRequest);

// // Get own requests (tenant only)
router.get(
  "/my-requests",
  auth("tenant"),
  RentalRequestController.getMyRequests
);

// // Get all requests (admin only)
router.get("/", auth("admin"), RentalRequestController.getAllRequests);

export const RentalRequestRoutes = router;
