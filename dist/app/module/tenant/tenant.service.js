"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const error_1 = __importDefault(require("../../helpers/error"));
const rentalHouse_model_1 = require("../rentalHouse/rentalHouse.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const tenant_model_1 = require("./tenant.model");
//New rental request for a house
const createTenantRequestIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenant, products: productId } = data;
    // Check if the tenant has already requested this product
    const existingRequest = yield tenant_model_1.Tenant.findOne({
        tenant,
        products: productId,
    });
    if (existingRequest) {
        throw new error_1.default(400, "You have already submitted a request for this property.");
    }
    // Create a new rental request
    const result = yield tenant_model_1.Tenant.create(data);
    return result;
});
const getTenantRequestsFromDB = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tenant_model_1.Tenant.find({ tenant: tenantId }).populate("products");
    return result;
});
const updateTenantProfileDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getAllRentalRequestsForLandlordFromDB = (landlordId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield rentalHouse_model_1.ProductModel.find({}).select("LandlordID");
    // console.log(products);
    const result = yield tenant_model_1.Tenant.find()
        .populate({
        path: "products",
        match: { LandlordID: landlordId },
    })
        .populate("tenant");
    // Filter out requests where products didn't match (i.e., landlord didn't own it)
    const filtered = result.filter((req) => req.products !== null);
    return filtered;
});
exports.TenantService = {
    createTenantRequestIntoDB,
    getTenantRequestsFromDB,
    updateTenantProfileDB,
    getAllRentalRequestsForLandlordFromDB,
};
