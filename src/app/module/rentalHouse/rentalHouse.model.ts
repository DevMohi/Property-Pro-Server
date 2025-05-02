import { Schema, model, Types } from "mongoose";
import { TProduct } from "./rentalHouse.interface";

const productSchema = new Schema<TProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },
    rent: {
      type: String,
      required: [true, "Rent is required"],
    },
    bedrooms: {
      type: String,
      required: [true, "Number of bedrooms is required"],
    },
    bathrooms: {
      type: String,
      required: [true, "Number of bathrooms is required"],
    },
    imageUrls: {
      type: [String],
      required: [true, "Product images are required"],
    },
    LandlordID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "LandlordID is required"], 
    },
    area: {
      type: String,
      required: [true, "Area is required"],
    },
    houseStatus: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<TProduct>("Product", productSchema);
