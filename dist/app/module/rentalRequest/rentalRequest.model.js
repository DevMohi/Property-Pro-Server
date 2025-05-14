"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequestModel = void 0;
const mongoose_1 = require("mongoose");
const rentalRequestSchema = new mongoose_1.Schema({
    rentalHouseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RentalHouse",
        required: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    landlordId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    moveInDate: {
        type: Date,
        required: true,
    },
    rentalDuration: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
    },
    phone: {
        type: String, // This is filled later if approved
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
    },
}, {
    timestamps: true,
});
exports.RentalRequestModel = (0, mongoose_1.model)("RentalRequest", rentalRequestSchema);
