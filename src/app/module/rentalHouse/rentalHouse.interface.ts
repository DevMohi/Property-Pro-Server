import { Types } from "mongoose";

export type TRentalHouse = {
  title: string;
  location: string;
  description: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  imageUrls: string[];
  images?: string[];
  landlordId: Types.ObjectId;
  area: string;
  houseStatus?: "available" | "rented";
};
