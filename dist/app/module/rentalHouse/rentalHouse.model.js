"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters long"],
    },
    rent: {
        type: String,
        required: [true, "Rent is required"],
    },
    bedrooms: {
        type: String,
        required: [true, "Number of bedrooms is required"],
    },
    bathrooms: {
        type: String,
        required: [true, "Number of bathrooms is required"],
    },
    imageUrls: {
        type: [String],
        required: [true, "Product images are required"],
    },
    LandlordID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, "LandlordID is required"], 
    },
    area: {
        type: String,
        required: [true, "Area is required"],
    },
    houseStatus: {
        type: String,
        enum: ["available", "rented"],
        default: "available",
    },
}, {
    timestamps: true,
});
exports.ProductModel = (0, mongoose_1.model)("Product", productSchema);
