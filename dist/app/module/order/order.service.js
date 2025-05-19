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
exports.RentalServices = void 0;
const rentalRequest_model_1 = require("../rentalRequest/rentalRequest.model");
const error_1 = __importDefault(require("../../helpers/error"));
const rentalHouse_model_1 = require("../rentalHouse/rentalHouse.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const order_utils_1 = require("./order.utils");
const order_model_1 = require("./order.model");
const querybuilder_1 = __importDefault(require("../../builder/querybuilder"));
const createRentalTransactionIntoDB = (rentalRequestId, userInfo, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalRequest = yield rentalRequest_model_1.RentalRequestModel.findById(rentalRequestId);
    if (!rentalRequest)
        throw new error_1.default(404, "Rental request not found");
    const tenant = yield user_model_1.default.findById(rentalRequest.tenantId);
    if (!tenant)
        throw new error_1.default(400, "No tenant found");
    const rentalHouse = yield rentalHouse_model_1.RentalHouseModel.findById(rentalRequest.rentalHouseId);
    if (!rentalHouse)
        throw new error_1.default(404, "Rental house not found");
    const existingTransaction = yield order_model_1.RentalTransactionModel.findOne({
        rentalRequestId: rentalRequest._id,
        tenantId: tenant._id,
        rentalHouseId: rentalHouse._id,
    });
    if (existingTransaction) {
        if (existingTransaction.status === "Paid") {
            throw new error_1.default(400, "This rental has already been paid for");
        }
        else if (existingTransaction.status === "Cancelled" ||
            existingTransaction.status === "Pending") {
            yield order_model_1.RentalTransactionModel.deleteOne({ _id: existingTransaction._id });
        }
        else {
            throw new error_1.default(400, "You already have a pending transaction for this request");
        }
    }
    if (rentalHouse.houseStatus === "rented") {
        throw new error_1.default(400, "The listing is already rented");
    }
    const user = yield user_model_1.default.findOne({ email: userInfo.email });
    const landlord = yield user_model_1.default.findById(rentalHouse.landlordId);
    if (!landlord)
        throw new error_1.default(404, "Landlord not found");
    const amount = Number(rentalHouse.rent);
    let order = yield order_model_1.RentalTransactionModel.create({
        rentalRequestId: rentalRequest._id,
        tenantId: tenant._id,
        rentalHouseId: rentalHouse._id,
        landlordId: landlord._id,
        amount,
    });
    const paymentPayload = {
        amount,
        order_id: order._id,
        currency: "BDT",
        customer_name: user === null || user === void 0 ? void 0 : user.name,
        customer_email: user === null || user === void 0 ? void 0 : user.email,
        customer_phone: user === null || user === void 0 ? void 0 : user.phone,
        customer_address: user === null || user === void 0 ? void 0 : user.address,
        customer_city: user === null || user === void 0 ? void 0 : user.city,
        client_ip,
    };
    const payment = yield order_utils_1.OrderUtils.makePaymentAsync(paymentPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment === null || payment === void 0 ? void 0 : payment.sp_order_id,
                transaction_status: payment === null || payment === void 0 ? void 0 : payment.transactionStatus,
                checkout_url: payment === null || payment === void 0 ? void 0 : payment.checkout_url,
            },
        });
    }
    return payment === null || payment === void 0 ? void 0 : payment.checkout_url;
});
const verifyPayment = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const verifiedPayment = yield order_utils_1.OrderUtils.verifyPaymentAsync(orderId);
    if (verifiedPayment[0].sp_code === "1011") {
        throw new error_1.default(404, "Order not found!");
    }
    if (verifiedPayment.length) {
        const updatedTransaction = yield order_model_1.RentalTransactionModel.findOneAndUpdate({
            "transaction.id": orderId,
        }, {
            "transaction.bank_status": verifiedPayment[0].bank_status,
            "transaction.sp_code": verifiedPayment[0].sp_code,
            "transaction.sp_message": verifiedPayment[0].sp_message,
            "transaction.transactionStatus": verifiedPayment[0].transaction_status,
            "transaction.method": verifiedPayment[0].method,
            "transaction.date_time": verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status === "Success"
                ? "Paid"
                : verifiedPayment[0].bank_status === "Failed"
                    ? "Pending"
                    : verifiedPayment[0].bank_status === "Cancel"
                        ? "Cancelled"
                        : "",
        }, { new: true });
        if (!updatedTransaction) {
            throw new error_1.default(404, "Transaction not found");
        }
        if (((_a = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.transaction) === null || _a === void 0 ? void 0 : _a.bank_status) === "Success") {
            yield rentalHouse_model_1.RentalHouseModel.findByIdAndUpdate(updatedTransaction.rentalHouseId, {
                houseStatus: "rented",
            });
            yield rentalRequest_model_1.RentalRequestModel.findByIdAndUpdate(updatedTransaction.rentalRequestId, {
                paymentStatus: "Paid",
            });
        }
    }
    return verifiedPayment;
});
const getTenantOrdersFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const tenant = yield user_model_1.default.findOne({ email });
    return yield order_model_1.RentalTransactionModel.find({ tenantId: tenant === null || tenant === void 0 ? void 0 : tenant._id })
        .populate("tenantId")
        .populate("rentalHouseId")
        .populate("landlordId");
});
const getAllRentalOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalOrdrsQuery = new querybuilder_1.default(order_model_1.RentalTransactionModel.find(), query).paginate();
    const result = yield rentalOrdrsQuery.modelQuery
        .populate("tenantId")
        .populate("rentalHouseId")
        .populate("landlordId");
    const meta = yield rentalOrdrsQuery.countTotal();
    return {
        meta,
        result,
    };
});
const cancelRentalOrderFromDB = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.RentalTransactionModel.findById(orderId);
    if (!order) {
        throw new error_1.default(404, "Order not found or deleted");
    }
    if (String(order.tenantId) !== String(userId)) {
        throw new error_1.default(403, "You are not authorized to cancel this order");
    }
    if (order.status === "Paid") {
        throw new error_1.default(400, "Paid orders cannot be cancelled");
    }
    yield order_model_1.RentalTransactionModel.findByIdAndDelete(orderId);
    yield rentalHouse_model_1.RentalHouseModel.findByIdAndUpdate(order.rentalHouseId, {
        houseStatus: "available",
    });
    return true;
});
exports.RentalServices = {
    createRentalTransactionIntoDB,
    verifyPayment,
    getTenantOrdersFromDB,
    getAllRentalOrdersFromDB,
    cancelRentalOrderFromDB,
};
