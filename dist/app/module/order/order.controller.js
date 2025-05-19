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
exports.RentalTransactionControllers = void 0;
const error_1 = __importDefault(require("../../helpers/error"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
// POST /order/rental-payment
const makeRentalPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new error_1.default(401, "Unauthorized: User not found in request");
    }
    const { rentalRequestId } = req.body;
    const result = yield order_service_1.RentalServices.createRentalTransactionIntoDB(rentalRequestId, req.user, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Rental payment initiated successfully",
        data: result,
    });
}));
// GET /order/verify?orderId=...
const paymentVerify = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.query;
    const result = yield order_service_1.RentalServices.verifyPayment(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order verified successfully",
        data: result,
    });
}));
// GET /order/my-order
const getTenantOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email;
    const result = yield order_service_1.RentalServices.getTenantOrdersFromDB(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Your rental transactions retrieved successfully",
        data: result,
    });
}));
// GET /order/all-orders (admin)
const getAllRentalOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.RentalServices.getAllRentalOrdersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All rental transactions retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
}));
// DELETE /order/cancel-order/:id
const cancelRentalOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderId = req.params.id;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield order_service_1.RentalServices.cancelRentalOrderFromDB(orderId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Rental order cancelled successfully",
        data: result,
    });
}));
exports.RentalTransactionControllers = {
    makeRentalPayment,
    paymentVerify,
    getTenantOrders,
    getAllRentalOrders,
    cancelRentalOrder,
};
