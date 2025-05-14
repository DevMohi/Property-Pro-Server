"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const rentalRequest_controller_1 = require("./rentalRequest.controller");
const router = express_1.default.Router();
// Create a rental request (tenant only)
router.post("/", (0, auth_1.default)("tenant"), rentalRequest_controller_1.RentalRequestController.createRequest);
// // Get own requests (tenant only)
router.get("/my-requests", (0, auth_1.default)("tenant"), rentalRequest_controller_1.RentalRequestController.getMyRequests);
// // Get all requests (admin only)
router.get("/", (0, auth_1.default)("admin"), rentalRequest_controller_1.RentalRequestController.getAllRequests);
router.get("/my-listing-requests", (0, auth_1.default)("landlord"), rentalRequest_controller_1.RentalRequestController.getRequestsForLandlord);
exports.RentalRequestRoutes = router;
