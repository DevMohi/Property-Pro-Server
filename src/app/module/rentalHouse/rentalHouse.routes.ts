import express from "express";
import { ProductControllers } from "./rentalHouse.controller";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create a new product ----------done
router.post(
  "/landlords/listings",
  auth("landlord"),
  multerUpload.fields([{ name: "images" }]),
  parseBody,
  ProductControllers.createProduct
);

// Get all products -------- done
router.get("/landlords/listings", ProductControllers.getAllProducts);

// Get a single product by ID----done
router.get(
  "/landlords/listings/:productId",
  ProductControllers.getSingleProduct
);

// Update a product by ID -----------
router.patch(
  "/landlords/listings/:id",
  auth("landlord"),
  multerUpload.fields([{ name: "images" }]),
  parseBody,
  ProductControllers.updateProduct
);

//Landlord postings
router.get(
  "/landlords/my-postings",
  auth("landlord"),
  ProductControllers.getLandlordPostings
);

//Respond to tenants
router.put(
  "/landlords/requests/:requestId",
  auth("landlord"),
  ProductControllers.respondToRentalRequest
);

// Delete a product by ID ---------- done
router.delete("/:productId", ProductControllers.deleteProduct);

export const ProductRoutes = router;
