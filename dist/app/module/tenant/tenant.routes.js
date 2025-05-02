"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const tenant_controller_1 = require("./tenant.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tenant_validation_1 = require("./tenant.validation");
const router = express_1.default.Router();
router.post("/requests", (0, auth_1.default)("tenant"), (0, validateRequest_1.default)(tenant_validation_1.TenantValidationSchema.createTenantValidationSchema), tenant_controller_1.TenantController.submitRequest);
router.get("/my-requests", (0, auth_1.default)("tenant"), tenant_controller_1.TenantController.getMyRequests);
router.put("/profile", (0, auth_1.default)("tenant"), tenant_controller_1.TenantController.updateTenantProfile);
router.get("/rental-requests", (0, auth_1.default)("landlord"), tenant_controller_1.TenantController.getRentalRequestsForLandlord);
exports.TenantRouter = router;
