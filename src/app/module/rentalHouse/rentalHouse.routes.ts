import express from "express";
import { RentalHouseControllers } from "./rentalHouse.controller";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import auth from "../../middlewares/auth";
import { RentalRequestController } from "../rentalRequest/rentalRequest.controller";

const router = express.Router();

// ✅ Create a new rental house listing -> Works
router.post(
  "/landlords/listings",
  auth("landlord"),
  multerUpload.fields([{ name: "images" }]),
  parseBody,
  RentalHouseControllers.createRentalHouse
);

// ✅ Get all rental house listings -> Works
router.get("/landlords/listings", RentalHouseControllers.getAllRentalHouses);

// ✅ Get a single rental house listing by ID
router.get(
  "/landlords/listings/:rentalHouseId",
  RentalHouseControllers.getSingleRentalHouse
);

// ✅ Update a rental house listing by ID -> Works
router.patch(
  "/landlords/listings/:id",
  auth("landlord"),
  multerUpload.fields([{ name: "images" }]),
  parseBody,
  RentalHouseControllers.updateRentalHouse
);

// ✅ Get all listings by a specific landlord (authenticated)
router.get(
  "/landlords/my-postings",
  auth("landlord"),
  RentalHouseControllers.getLandlordRentalHouses
);

// ✅ Respond to tenant rental request (approve/reject)
router.put(
  "/landlords/requests/:requestId",
  auth("landlord"),
  RentalHouseControllers.respondToRentalRequest
);

// ✅ Delete a rental house listing by ID
router.delete("/:rentalHouseId", RentalHouseControllers.deleteRentalHouse);

// Exporting router
export const RentalHouseRoutes = router;
