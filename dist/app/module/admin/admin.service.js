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
exports.adminService = void 0;
const querybuilder_1 = __importDefault(require("../../builder/querybuilder"));
const order_model_1 = require("../order/order.model");
const rentalHouse_model_1 = require("../rentalHouse/rentalHouse.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const getAllHouses = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_model_1.RentalHouseModel.find();
    return result;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new querybuilder_1.default(user_model_1.default.find(), query).paginate();
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return {
        meta, result
    };
});
const getAllRentalTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.RentalTransactionModel.find();
    return result;
});
const deleteUserByAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findByIdAndDelete(userId);
    return result;
});
const userSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const houses = yield rentalHouse_model_1.RentalHouseModel.find();
    const users = yield user_model_1.default.find();
    const tenant = yield user_model_1.default.find({ role: "tenant" });
    const landlord = yield user_model_1.default.find({ role: "landlord" });
    return {
        houses: houses.length,
        users: users.length,
        tenants: tenant.length,
        landlord: landlord.length,
    };
});
exports.adminService = {
    getAllHouses,
    getAllUsers,
    userSummary,
    getAllRentalTransactions,
    deleteUserByAdmin,
};
