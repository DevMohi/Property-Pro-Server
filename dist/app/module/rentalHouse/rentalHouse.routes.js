"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalHouseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const rentalHouse_controller_1 = require("./rentalHouse.controller");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// ✅ Create a new rental house listing -> Works
router.post("/listings", (0, auth_1.default)("landlord"), multer_config_1.multerUpload.fields([{ name: "images" }]), bodyParser_1.parseBody, rentalHouse_controller_1.RentalHouseControllers.createRentalHouse);
// ✅ Get all rental house listings -> Works
router.get("/listings", rentalHouse_controller_1.RentalHouseControllers.getAllRentalHouses);
// ✅ Get a single rental house listing by ID
router.get("/listings/:rentalHouseId", rentalHouse_controller_1.RentalHouseControllers.getSingleRentalHouse);
// ✅ Update a rental house listing by ID -> Works
router.patch("/listings/:id", (0, auth_1.default)("admin", "landlord"), multer_config_1.multerUpload.fields([{ name: "images" }]), bodyParser_1.parseBody, rentalHouse_controller_1.RentalHouseControllers.updateRentalHouse);
// ✅ Get all listings by a specific landlord (authenticated)
router.get("/my-postings", (0, auth_1.default)("landlord"), rentalHouse_controller_1.RentalHouseControllers.getLandlordRentalHouses);
// ✅ Respond to tenant rental request (approve/reject)
router.put("/requests/:requestId", (0, auth_1.default)("landlord"), rentalHouse_controller_1.RentalHouseControllers.respondToRentalRequest);
// ✅ Delete a rental house listing by ID
router.delete("/:rentalHouseId", (0, auth_1.default)("admin", "landlord"), rentalHouse_controller_1.RentalHouseControllers.deleteRentalHouse);
// Exporting router
exports.RentalHouseRoutes = router;
