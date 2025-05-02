import { z } from "zod";
import mongoose from "mongoose";

const isValidObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);

export const createTenantValidationSchema = z.object({
  body: z.object({
    products: z
      .string({
        required_error: "Product ID is required",
      })
      .refine(isValidObjectId, {
        message: "Invalid Product ID",
      }),
    message: z
      .string({
        required_error: "Message is required",
      })
      .min(10, "Message must be at least 10 characters"),
  }),
});

export const TenantValidationSchema = {
  createTenantValidationSchema,
};
