"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name must be provided and must be a string",
        })
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(50, { message: "Name cannot exceed 50 characters" }),
        email: zod_1.z
            .string({
            required_error: "Email must be provided and must be a string",
        })
            .email({ message: "Invalid email address" }),
        password: zod_1.z
            .string({
            required_error: "Password is required for your safety",
        })
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(20, { message: "Password cannot exceed 20 characters" }),
        role: zod_1.z
            .enum(["admin", "landlord", "tenant"], {
            required_error: "Role must be provided and must be 'landlord' or 'tenant'",
        })
            .default("tenant"),
        phone: zod_1.z.string(),
        address: zod_1.z.string({
            required_error: "Address must be provided",
        }),
        city: zod_1.z.string({
            required_error: "City must be provided",
        }),
        createdAt: zod_1.z.date().default(() => new Date()),
        updatedAt: zod_1.z.date().default(() => new Date()),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
