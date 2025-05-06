import { RentalRequestModel } from "./rentalRequest.model";
import { TRentalRequest } from "./rentalRequest.interface";

import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/error";
import { RentalHouseModel } from "../rentalHouse/rentalHouse.model";

// Create a new rental request
const createRentalRequest = async (data: TRentalRequest) => {
  // Lookup the rental house to get the landlord ID
  const rentalHouse = await RentalHouseModel.findById(data.rentalHouseId);
  if (!rentalHouse) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental house not found");
  }

  // Check for duplicate request
  const exists = await RentalRequestModel.findOne({
    rentalHouseId: data.rentalHouseId,
    tenantId: data.tenantId,
  });

  if (exists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You have already requested this rental"
    );
  }

  // Assign landlord ID
  data.landlordId = rentalHouse.landlordId;

  const result = await RentalRequestModel.create(data);
  return result;
};

// Get all requests for a specific tenant
const getRequestsByTenant = async (tenantId: string) => {
  return await RentalRequestModel.find({ tenantId }).populate("rentalHouseId");
};

// Get all requests (admin only)
const getAllRequests = async () => {
  return await RentalRequestModel.find().populate(
    "rentalHouseId tenantId landlordId"
  );
};

export const RentalRequestService = {
  createRentalRequest,
  getRequestsByTenant,
  getAllRequests,
};
