"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantValidationSchema = exports.createTenantValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (value) => mongoose_1.default.Types.ObjectId.isValid(value);
exports.createTenantValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        products: zod_1.z
            .string({
            required_error: "Product ID is required",
        })
            .refine(isValidObjectId, {
            message: "Invalid Product ID",
        }),
        message: zod_1.z
            .string({
            required_error: "Message is required",
        })
            .min(10, "Message must be at least 10 characters"),
    }),
});
exports.TenantValidationSchema = {
    createTenantValidationSchema: exports.createTenantValidationSchema,
};
