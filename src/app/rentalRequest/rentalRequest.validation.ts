import { z } from "zod";
import mongoose from "mongoose";

const isValidObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);

export const createRentalRequestValidation = z.object({
  body: z.object({
    rentalHouseId: z
      .string({ required_error: "Rental house ID is required" })
      .refine(isValidObjectId, {
        message: "Invalid rental house ID",
      }),
    moveInDate: z
      .string({ required_error: "Move-in date is required" })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid move-in date",
      }),
    rentalDuration: z
      .string({ required_error: "Rental duration is required" })
      .min(2, "Rental duration must be at least 2 characters"),
    message: z
      .string({ required_error: "Message is required" })
      .min(10, "Message must be at least 10 characters long"),
  }),
});

export const RentalRequestValidation = {
  createRentalRequestValidation,
};
