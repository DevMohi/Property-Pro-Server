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
exports.RentalHouseControllers = void 0;
const rentalHouse_service_1 = require("./rentalHouse.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
// Create a new rental house listing
const createRentalHouse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalHouseData = Object.assign(Object.assign({}, req.body), { landlordId });
    const result = yield rentalHouse_service_1.RentalHouseServices.createRentalHouseInDB(rentalHouseData, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Rental house listing created successfully",
        data: result,
    });
}));
// Get all rental house listings -> pagination done here
const getAllRentalHouses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_service_1.RentalHouseServices.getAllRentalHousesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All rental listings retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
}));
// Get a single rental house listing
const getSingleRentalHouse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalHouseId } = req.params;
    const result = yield rentalHouse_service_1.RentalHouseServices.getSingleRentalHouseFromDB(rentalHouseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Rental house listing retrieved successfully",
        data: result,
    });
}));
// Update a rental house listing
const updateRentalHouse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalHouseId = req.params.id;
    const updatedData = Object.assign(Object.assign({}, req.body), { landlordId });
    const result = yield rentalHouse_service_1.RentalHouseServices.updateRentalHouseInDB(rentalHouseId, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Rental house listing updated successfully",
        data: result,
    });
}));
// Delete a rental house listing
const deleteRentalHouse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalHouseId } = req.params;
    console.log(rentalHouseId);
    const result = yield rentalHouse_service_1.RentalHouseServices.deleteRentalHouseFromDB(rentalHouseId);
    if (!result) {
        res.status(404).json({
            success: false,
            message: "Rental house not found",
        });
        return; // just stop here, don't return the res object
    }
    res.status(200).json({
        success: true,
        message: "Rental house deleted successfully",
        data: result,
    });
}));
// Get listings by landlord (private route)
const getLandlordRentalHouses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log(landlordId);
    const result = yield rentalHouse_service_1.RentalHouseServices.getLandlordRentalHouses(landlordId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Your rental house listings retrieved",
        data: result,
    });
}));
// Respond to a rental request (approve/reject)
const respondToRentalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { requestId } = req.params;
    const { status, phoneNumber } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield rentalHouse_service_1.RentalHouseServices.respondToRentalRequestDB(requestId, status, userId, phoneNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Rental request responded to successfully",
        data: result,
    });
}));
// Export controller
exports.RentalHouseControllers = {
    createRentalHouse,
    getAllRentalHouses,
    getSingleRentalHouse,
    updateRentalHouse,
    deleteRentalHouse,
    getLandlordRentalHouses,
    respondToRentalRequest,
};
