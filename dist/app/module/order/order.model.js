"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalTransaction = void 0;
const mongoose_1 = require("mongoose");
const rentalTransactionSchema = new mongoose_1.Schema({
    tenantRequest: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    landlord: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"],
        default: "Pending",
    },
    transaction: {
        id: { type: String },
        transaction_status: { type: String },
        bank_status: { type: String },
        sp_code: { type: String },
        sp_message: { type: String },
        method: { type: String },
        date_time: { type: String },
    },
}, { timestamps: true });
exports.RentalTransaction = (0, mongoose_1.model)("RentalTransaction", rentalTransactionSchema);
