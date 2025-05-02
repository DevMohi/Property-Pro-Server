import { Schema, model } from "mongoose";
import { TRentalTransaction } from "./order.interface";

const rentalTransactionSchema = new Schema<TRentalTransaction>(
  {
    tenantRequest: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    landlord: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    transaction: {
      id: { type: String },
      transaction_status: { type: String },
      bank_status: { type: String },
      sp_code: { type: String },
      sp_message: { type: String },
      method: { type: String },
      date_time: { type: String },
    },
  },
  { timestamps: true }
);

export const RentalTransaction = model<TRentalTransaction>(
  "RentalTransaction",
  rentalTransactionSchema
);
