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
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const error_1 = __importDefault(require("../../helpers/error"));
const getAllHousesByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const houses = yield admin_service_1.adminService.getAllHouses();
    if (!houses || houses.length === 0) {
        throw new Error("No houses found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Houses retrieved successfully",
        data: houses,
    });
}));
const getAllUsersByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield admin_service_1.adminService.getAllUsers(req.query);
    if (!users) {
        throw new Error("No users found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Users retrieved successfully",
        data: users.result,
        meta: users.meta,
    });
}));
const getAllRentalTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.adminService.getAllRentalTransactions();
    if (!result || result.length === 0) {
        throw new error_1.default(404, "No Rental Transaction Found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "All Rental Transaction Retrieved Successfully",
        data: result,
    });
}));
const userSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.adminService.userSummary();
    if (!result) {
        throw new error_1.default(404, "No Summary Found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Summary Retrieved Successfully",
        data: result,
    });
}));
const userDeleteByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    // console.log("userId", userId);
    const result = yield admin_service_1.adminService.deleteUserByAdmin(userId);
    if (!result) {
        throw new Error("User not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User deleted successfully",
        data: result,
    });
}));
exports.adminController = {
    getAllHousesByAdmin,
    getAllUsersByAdmin,
    userSummary,
    getAllRentalTransactions,
    userDeleteByAdmin,
};
