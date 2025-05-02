import { Types } from "mongoose";

export interface ITenant {
  products: Types.ObjectId;
  tenant: Types.ObjectId;
  status?: "Pending" | "Approved" | "Rejected";
  message: string;
  phone?: string;
  paymentStatus?: "Pending" | "Paid";
}
