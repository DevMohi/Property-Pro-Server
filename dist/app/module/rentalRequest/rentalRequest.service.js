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
exports.RentalRequestService = void 0;
const rentalRequest_model_1 = require("./rentalRequest.model");
const http_status_codes_1 = require("http-status-codes");
const error_1 = __importDefault(require("../../helpers/error"));
const rentalHouse_model_1 = require("../rentalHouse/rentalHouse.model");
const querybuilder_1 = __importDefault(require("../../builder/querybuilder"));
// Create a new rental request
const createRentalRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Lookup the rental house to get the landlord ID
    const rentalHouse = yield rentalHouse_model_1.RentalHouseModel.findById(data.rentalHouseId);
    if (!rentalHouse) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rental house not found");
    }
    // Check for duplicate request
    const exists = yield rentalRequest_model_1.RentalRequestModel.findOne({
        rentalHouseId: data.rentalHouseId,
        tenantId: data.tenantId,
    });
    if (exists) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You have already requested this rental");
    }
    // Assign landlord ID
    data.landlordId = rentalHouse.landlordId;
    const result = yield rentalRequest_model_1.RentalRequestModel.create(data);
    return result;
});
// Get all requests for a specific tenant
const getRequestsByTenant = (tenantId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantRequestsQuery = new querybuilder_1.default(rentalRequest_model_1.RentalRequestModel.find({ tenantId }), query).paginate();
    const result = yield tenantRequestsQuery.modelQuery.populate("rentalHouseId");
    const meta = yield tenantRequestsQuery.countTotal();
    return {
        result,
        meta,
    };
});
// Get all requests (admin only)
const getAllRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantRequestsQuery = new querybuilder_1.default(rentalRequest_model_1.RentalRequestModel.find(), query).paginate();
    const result = yield tenantRequestsQuery.modelQuery.populate("rentalHouseId tenantId landlordId");
    const meta = yield tenantRequestsQuery.countTotal();
    return {
        meta,
        result,
    };
});
//aita pore
const getAllRequestsForLandlord = (landlordId) => __awaiter(void 0, void 0, void 0, function* () {
    const houses = yield rentalHouse_model_1.RentalHouseModel.find({ landlordId }).select("_id");
    const houseIds = houses.map((house) => house._id);
    const requests = yield rentalRequest_model_1.RentalRequestModel.find({
        rentalHouseId: { $in: houseIds },
    })
        .populate("tenantId")
        .populate("rentalHouseId");
    return requests;
});
exports.RentalRequestService = {
    createRentalRequest,
    getRequestsByTenant,
    getAllRequests,
    getAllRequestsForLandlord,
};
