"use strict";
// import { RequestHandler } from "express";
// import { createRentalTransaction } from "./rentalTransaction.service";
// import catchAsync from "../../utils/catchAsync";
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
exports.RentalControllers = void 0;
const error_1 = __importDefault(require("../../helpers/error"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
//   const tenantId = req.params.tenantId;
//   const user = req.user;
//   const client_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const checkoutUrl = await createRentalTransaction(tenantId, user, client_ip as string);
//   res.status(200).json({
//     success: true,
//     message: "Redirect to ShurjoPay",
//     data: checkoutUrl,
//   });
// });
const makeRentalPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body); 
    if (!req.user) {
        throw new error_1.default(401, "Unauthorized: User not found in request");
    }
    const { tenantRequest } = req.body;
    const result = yield order_service_1.RentalServices.createRentalTransactionIntoDB(tenantRequest, req.user, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Renting Payment Intitiated Successfully",
        data: result,
        // data: result,
    });
}));
// Order Verify Controllers
const rentalVerify = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req?.query?.id); 
    const result = yield order_service_1.RentalServices.verifyPayment(req.query.orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order Verified Successful",
        data: result,
    });
}));
const getTenantOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield order_service_1.RentalServices.getTenantOrdersFromDB((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Your orders that have been paid or ordered recieved successfully",
        data: result,
    });
}));
//For admin too see
const getAllRentalOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.RentalServices.getAllRentalOrdersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Rental Orders Retrieved Successfully",
        data: result,
    });
}));
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
exports.RentalControllers = {
    makeRentalPayment,
    rentalVerify,
    getTenantOrders,
    getAllRentalOrders,
    cancelRentalOrder,
};
