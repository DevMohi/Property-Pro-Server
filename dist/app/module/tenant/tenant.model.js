"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const mongoose_1 = require("mongoose");
const tenantSchema = new mongoose_1.Schema({
    products: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    message: { type: String, required: true },
    phone: { type: String },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
    },
}, { timestamps: true });
exports.Tenant = (0, mongoose_1.model)("Tenant", tenantSchema);
