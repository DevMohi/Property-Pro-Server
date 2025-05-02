import { Types } from "mongoose";

export type TProduct = {
  title: string; //add
  location: string;
  description: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  imageUrls: string[];
  images?: string[];
  LandlordID: Types.ObjectId;
  area: string;
  houseStatus?: "available" | "rented";
};
