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
exports.RentalRequestController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const rentalRequest_service_1 = require("./rentalRequest.service");
const createRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const data = Object.assign(Object.assign({}, req.body), { tenantId });
    const result = yield rentalRequest_service_1.RentalRequestService.createRentalRequest(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Rental request submitted successfully",
        data: result,
    });
}));
const getMyRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield rentalRequest_service_1.RentalRequestService.getRequestsByTenant(tenantId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Retrieved your rental requests",
        data: result,
    });
}));
const getAllRequests = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalRequest_service_1.RentalRequestService.getAllRequests();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Retrieved all rental requests",
        data: result,
    });
}));
//Individual all requests
const getRequestsForLandlord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield rentalRequest_service_1.RentalRequestService.getAllRequestsForLandlord(landlordId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All tenant requests for your rental listings retrieved successfully",
        data: result,
    });
}));
exports.RentalRequestController = {
    createRequest,
    getMyRequests,
    getAllRequests,
    getRequestsForLandlord,
};
