import { Types } from "mongoose";

export type TRentalTransaction = {
  rentalRequestId: Types.ObjectId; // Previously: tenantRequest
  tenantId: Types.ObjectId; // Previously: tenant
  rentalHouseId: Types.ObjectId; // Previously: product
  landlordId: Types.ObjectId; // Previously: landlord
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
