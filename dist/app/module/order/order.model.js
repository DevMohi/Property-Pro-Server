"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalTransactionModel = void 0;
const mongoose_1 = require("mongoose");
const rentalTransactionSchema = new mongoose_1.Schema({
    rentalRequestId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RentalRequest", // previously Tenant
        required: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // tenant user
        required: true,
    },
    rentalHouseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RentalHouse", // previously Product
        required: true,
    },
    landlordId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"],
        default: "Pending",
    },
    transaction: {
        id: { type: String },
        transaction_status: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, {
    timestamps: true,
});
exports.RentalTransactionModel = (0, mongoose_1.model)("RentalTransaction", rentalTransactionSchema);
