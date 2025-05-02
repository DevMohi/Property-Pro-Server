"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const rentalHouse_controller_1 = require("./rentalHouse.controller");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Create a new product ----------done
router.post("/landlords/listings", (0, auth_1.default)("landlord"), multer_config_1.multerUpload.fields([{ name: "images" }]), bodyParser_1.parseBody, rentalHouse_controller_1.ProductControllers.createProduct);
// Get all products -------- done
router.get("/landlords/listings", rentalHouse_controller_1.ProductControllers.getAllProducts);
// Get a single product by ID----done
router.get("/landlords/listings/:productId", rentalHouse_controller_1.ProductControllers.getSingleProduct);
// Update a product by ID -----------
router.patch("/landlords/listings/:id", (0, auth_1.default)("landlord"), multer_config_1.multerUpload.fields([{ name: "images" }]), bodyParser_1.parseBody, rentalHouse_controller_1.ProductControllers.updateProduct);
//Landlord postings
router.get("/landlords/my-postings", (0, auth_1.default)("landlord"), rentalHouse_controller_1.ProductControllers.getLandlordPostings);
//Respond to tenants
router.put("/landlords/requests/:requestId", (0, auth_1.default)("landlord"), rentalHouse_controller_1.ProductControllers.respondToRentalRequest);
// Delete a product by ID ---------- done
router.delete("/:productId", rentalHouse_controller_1.ProductControllers.deleteProduct);
exports.ProductRoutes = router;
