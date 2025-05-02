import { model, Schema } from "mongoose";
import { ITenant } from "./tenant.interface";

const tenantSchema = new Schema<ITenant>(
  {
    products: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    tenant: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    message: { type: String, required: true },
    phone: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Tenant = model<ITenant>("Tenant", tenantSchema);
