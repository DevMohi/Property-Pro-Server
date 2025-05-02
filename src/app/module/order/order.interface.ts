import { Types } from "mongoose";

export type TRentalTransaction = {
  tenantRequest: Types.ObjectId; // from Tenant
  tenant: Types.ObjectId;
  product: Types.ObjectId; // from Product model
  landlord: Types.ObjectId; // from User model (Landlord)
  amount: number;
  status: "Pending" | "Paid" | "Cancelled";
  transaction: {
    id: string;
    transaction_status?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string;
    date_time?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
