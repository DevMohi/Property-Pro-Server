import { Types } from "mongoose";

export type TRentalRequest = {
  rentalHouseId: Types.ObjectId;
  tenantId: Types.ObjectId;
  landlordId?: Types.ObjectId;
  moveInDate: Date;
  rentalDuration: string;
  message: string;
  phone?: string;
  status: "Pending" | "Approved" | "Rejected";
};
