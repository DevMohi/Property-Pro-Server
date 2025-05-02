"use strict";
// import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../helpers/error";
// import { ProductModel } from "../rentalHouse/rentalHouse.model";
// import { Tenant } from "../tenant/tenant.model";
// import User from "../user/user.model";
// import { TRentalTransaction } from "./order.interface";
// import { RentalTransaction } from "./order.model";
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
const tenant_model_1 = require("../tenant/tenant.model");
const error_1 = __importDefault(require("../../helpers/error"));
const rentalHouse_model_1 = require("../rentalHouse/rentalHouse.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const order_model_1 = require("./order.model");
const order_utils_1 = require("./order.utils");
const createRentalTransactionIntoDB = (tenantId, userInfo, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(client_ip); 
    const tenantRequest = yield tenant_model_1.Tenant.findById(tenantId).populate("products");
    // console.log(tenantRequest);  
    if (!tenantRequest)
        throw new error_1.default(404, "Rental request not found");
    // console.log(tenantRequest);
    const tenant = yield user_model_1.default.findOne(tenantRequest === null || tenantRequest === void 0 ? void 0 : tenantRequest.tenant);
    if (!tenant) {
        throw new error_1.default(400, "No tenant found");
    }
    const product = yield rentalHouse_model_1.ProductModel.findById(tenantRequest.products);
    const existingTransaction = yield order_model_1.RentalTransaction.findOne({
        tenantRequest: tenantRequest._id,
        tenant: tenant._id,
        product: product === null || product === void 0 ? void 0 : product._id,
    });
    // if (existingTransaction) {
    //   if (existingTransaction.status === "Paid" ) {
    //     throw new AppError(400, "This rental has already been paid for");
    //   } else {
    //     throw new AppError(
    //       400,
    //       "You already have a pending transaction for this request"
    //     );
    //   }
    // }
    if (existingTransaction) {
        if ((existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.status) === "Paid") {
            throw new error_1.default(400, "This rental has already been paid for");
        }
        else if ((existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.status) === "Cancelled" ||
            (existingTransaction === null || existingTransaction === void 0 ? void 0 : existingTransaction.status) === "Pending") {
            yield order_model_1.RentalTransaction.deleteOne({ _id: existingTransaction._id });
        }
        else {
            throw new error_1.default(400, "You already have a pending transaction for this request");
        }
    }
    if ((product === null || product === void 0 ? void 0 : product.houseStatus) === "rented") {
        throw new error_1.default(400, "The listing is already rented");
    }
    const user = yield user_model_1.default.findOne({ email: userInfo.email });
    // console.log("user", userName?.name);
    if (!product)
        throw new error_1.default(404, "Product not found");
    const landlord = yield user_model_1.default.findById(product.LandlordID);
    if (!landlord)
        throw new error_1.default(404, "Landlord not found");
    // console.log("Inside user", userInfo);
    const amount = Number(product.rent);
    let order = yield order_model_1.RentalTransaction.create({
        tenantRequest: tenantRequest._id,
        tenant: tenant._id,
        product: product._id,
        landlord: landlord._id,
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
    // console.log(transaction);
    // console.log(paymentPayload);
    const payment = yield order_utils_1.OrderUtils.makePaymentAsync(paymentPayload);
    // console.log(payment);
    // if ((payment as any)?.transactionStatus) {
    //   order = await order.updateOne({
    //     transaction: {
    //       id: (payment as any)?.sp_order_id,
    //       transaction_status: (payment as any)?.transactionStatus,
    //       checkout_url: (payment as any)?.checkout_url,
    //     },
    //   });
    // }
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
    // console.log(verifiedPayment[0].sp_code); 
    if (verifiedPayment[0].sp_code === "1011") {
        throw new error_1.default(404, "Order not found!");
    }
    if (verifiedPayment.length) {
        const updatedTransaction = yield order_model_1.RentalTransaction.findOneAndUpdate({
            "transaction.id": orderId,
        }, {
            "transaction.bank_status": verifiedPayment[0].bank_status,
            "transaction.sp_code": verifiedPayment[0].sp_code,
            "transaction.sp_message": verifiedPayment[0].sp_message,
            "transaction.transactionStatus": verifiedPayment[0].transaction_status,
            "transaction.method": verifiedPayment[0].method,
            "transaction.date_time": verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == "Success"
                ? "Paid"
                : verifiedPayment[0].bank_status == "Failed"
                    ? "Pending"
                    : verifiedPayment[0].bank_status == "Cancel"
                        ? "Cancelled"
                        : "",
        }, { new: true });
        if (!updatedTransaction) {
            throw new error_1.default(404, "Transaction not found");
        }
        if (((_a = updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.transaction) === null || _a === void 0 ? void 0 : _a.bank_status) === "Success") {
            yield rentalHouse_model_1.ProductModel.findByIdAndUpdate(updatedTransaction.product, {
                houseStatus: "rented",
            });
            yield tenant_model_1.Tenant.findByIdAndUpdate(updatedTransaction.tenantRequest, {
                paymentStatus: "Paid",
            });
        }
    }
    return verifiedPayment;
});
const getTenantOrdersFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const tenant = yield user_model_1.default.findOne({ email });
    // console.log("tenant", tenant); 
    const result = yield order_model_1.RentalTransaction.find({ tenant: tenant === null || tenant === void 0 ? void 0 : tenant._id })
        .populate("tenant")
        .populate("product");
    return result;
});
const getAllRentalOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.RentalTransaction.find()
        .populate("tenant")
        .populate("product")
        .populate("landlord");
    return result;
});
const cancelRentalOrderFromDB = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.RentalTransaction.findById(orderId);
    if (!order) {
        throw new error_1.default(404, "Order not found or deleted");
    }
    // console.log(order.tenant, userId); 
    // Ensure only the correct tenant can cancel
    if (String(order.tenant) !== String(userId)) {
        throw new error_1.default(403, "You are not authorized to cancel this order");
    }
    if (order.status === "Paid") {
        throw new error_1.default(400, "Paid orders cannot be cancelled");
    }
    yield order_model_1.RentalTransaction.findByIdAndDelete(orderId);
    // Optionally revert houseStatus
    yield rentalHouse_model_1.ProductModel.findByIdAndUpdate(order.product, {
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
