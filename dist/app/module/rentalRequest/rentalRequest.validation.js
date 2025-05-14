"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequestValidation = exports.createRentalRequestValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (value) => mongoose_1.default.Types.ObjectId.isValid(value);
exports.createRentalRequestValidation = zod_1.z.object({
    body: zod_1.z.object({
        rentalHouseId: zod_1.z
            .string({ required_error: "Rental house ID is required" })
            .refine(isValidObjectId, {
            message: "Invalid rental house ID",
        }),
        moveInDate: zod_1.z
            .string({ required_error: "Move-in date is required" })
            .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid move-in date",
        }),
        rentalDuration: zod_1.z
            .string({ required_error: "Rental duration is required" })
            .min(2, "Rental duration must be at least 2 characters"),
        message: zod_1.z
            .string({ required_error: "Message is required" })
            .min(10, "Message must be at least 10 characters long"),
    }),
});
exports.RentalRequestValidation = {
    createRentalRequestValidation: exports.createRentalRequestValidation,
};
