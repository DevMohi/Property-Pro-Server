import { Schema, model } from "mongoose";
import { TRentalTransaction } from "./order.interface";

const rentalTransactionSchema = new Schema<TRentalTransaction>(
  {
    rentalRequestId: {
      type: Schema.Types.ObjectId,
      ref: "RentalRequest", // previously Tenant
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User", // tenant user
      required: true,
    },
    rentalHouseId: {
      type: Schema.Types.ObjectId,
      ref: "RentalHouse", // previously Product
      required: true,
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    transaction: {
      id: { type: String },
      transaction_status: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true,
  }
);

export const RentalTransactionModel = model<TRentalTransaction>(
  "RentalTransaction",
  rentalTransactionSchema
);
