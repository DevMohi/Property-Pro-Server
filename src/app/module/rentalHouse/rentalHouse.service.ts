import mongoose from "mongoose";
import { TRentalHouse } from "./rentalHouse.interface";
import { RentalHouseModel } from "./rentalHouse.model";
import AppError from "../../helpers/error";
import { StatusCodes } from "http-status-codes";
import { IImageFiles } from "../../middlewares/interface/IImageFile";
import { Tenant } from "../tenant/tenant.model";
import User from "../user/user.model";

// Create a new rental house listing
const createRentalHouseInDB = async (
  rentalHouseData: Partial<TRentalHouse>,
  imageFiles: IImageFiles
) => {
  const { images } = imageFiles;
  if (!images || images.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Images are required.");
  }

  rentalHouseData.imageUrls = images.map((image) => image.path);
  const result = await RentalHouseModel.create(rentalHouseData);
  return result;
};

// Get all listings
const getAllRentalHousesFromDB = async () => {
  const result = await RentalHouseModel.find();
  return result;
};

// Get a single listing by ID
const getSingleRentalHouseFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const result = await RentalHouseModel.findById(id);
  return result;
};

// Update listing by ID
const updateRentalHouseInDB = async (
  rentalHouseId: string,
  updatedData: Partial<TRentalHouse>
) => {
  const result = await RentalHouseModel.findByIdAndUpdate(
    rentalHouseId,
    updatedData,
    { new: true, runValidators: true }
  );

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental house not found");
  }

  return result;
};

// Delete a listing by ID
const deleteRentalHouseFromDB = async (
  id: string
): Promise<TRentalHouse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await RentalHouseModel.findOneAndDelete({ _id: id });
};

//landlord can retrieve its own listings
const getLandlordRentalHouses = async (landlordId: string) => {
  console.log("Inside", landlordId);
  const result = await RentalHouseModel.find({ landlordId });
  return result;
};

// Respond to a rental request (approve/reject)
// const respondToRentalRequestDB = async (
//   requestId: string,
//   status: "Approved" | "Rejected",
//   userId: string,
//   phoneNumber?: string
// ) => {
//   const request = await Tenant.findById(requestId);

//   if (!request) {
//     throw new AppError(400, "Tenant Request Not found");
//   }

//   const product = await RentalHouseModel.findById(request.products);
//   if (!product) {
//     throw new AppError(400, "Product Not found");
//   }

//   const landlord = await User.findById(product.LandlordID);
//   if (!landlord) {
//     throw new AppError(400, "User Not found");
//   }

//   // console.log(product.LandlordID.toString(), userId);

//   if (product.LandlordID.toString() !== userId) {
//     // console.log("Inside here");
//     throw new AppError(
//       400,
//       "You are not authorized to respond to this request"
//     );
//   }

//   // If status is "Approved", check if the landlord's phone number is provided
//   const landlordPhone = landlord.phone || phoneNumber;
//   if (status === "Approved") {
//     if (!landlord?.phone) {
//       if (!landlordPhone) {
//         throw new AppError(404, "Phone number is required");
//       }
//       request.phone = landlordPhone;
//     } else {
//       request.phone = landlordPhone;
//     }
//   } else if (status === "Rejected") {
//     request.phone = landlordPhone;
//   }

//   request.status = status; // Update the status to Approved/Rejected
//   await request.save(); // Save the changes

//   return request;
// };

// Exporting all services
export const RentalHouseServices = {
  createRentalHouseInDB,
  getAllRentalHousesFromDB,
  getSingleRentalHouseFromDB,
  updateRentalHouseInDB,
  deleteRentalHouseFromDB,
  getLandlordRentalHouses,
  // respondToRentalRequestDB,
};
