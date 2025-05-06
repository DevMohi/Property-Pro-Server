import { Schema, model, Types } from "mongoose";
import { TRentalRequest } from "./rentalRequest.interface";

const rentalRequestSchema = new Schema<TRentalRequest>(
  {
    rentalHouseId: {
      type: Schema.Types.ObjectId,
      ref: "RentalHouse",
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlordId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const RentalRequestModel = model<TRentalRequest>(
  "RentalRequest",
  rentalRequestSchema
);
