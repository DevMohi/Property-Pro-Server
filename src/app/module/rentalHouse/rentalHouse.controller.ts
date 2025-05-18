/* eslint-disable no-console */
import { Request, Response } from "express";
import { RentalHouseServices } from "./rentalHouse.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IImageFiles } from "../../middlewares/interface/IImageFile";

// Create a new rental house listing
const createRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id;
  const rentalHouseData = { ...req.body, landlordId };
  const result = await RentalHouseServices.createRentalHouseInDB(
    rentalHouseData,
    req.files as IImageFiles
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Rental house listing created successfully",
    data: result,
  });
});

// Get all rental house listings -> pagination done here
const getAllRentalHouses = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalHouseServices.getAllRentalHousesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All rental listings retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

// Get a single rental house listing
const getSingleRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const { rentalHouseId } = req.params;

  const result = await RentalHouseServices.getSingleRentalHouseFromDB(
    rentalHouseId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Rental house listing retrieved successfully",
    data: result,
  });
});

// Update a rental house listing
const updateRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id;
  const rentalHouseId = req.params.id;

  const updatedData = { ...req.body, landlordId };

  const result = await RentalHouseServices.updateRentalHouseInDB(
    rentalHouseId,
    updatedData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Rental house listing updated successfully",
    data: result,
  });
});

// Delete a rental house listing
const deleteRentalHouse = catchAsync(async (req, res) => {
  const { rentalHouseId } = req.params;
  console.log(rentalHouseId);

  const result = await RentalHouseServices.deleteRentalHouseFromDB(
    rentalHouseId
  );

  if (!result) {
    res.status(404).json({
      success: false,
      message: "Rental house not found",
    });
    return; // just stop here, don't return the res object
  }

  res.status(200).json({
    success: true,
    message: "Rental house deleted successfully",
    data: result,
  });
});

// Get listings by landlord (private route)
const getLandlordRentalHouses = catchAsync(
  async (req: Request, res: Response) => {
    const landlordId = req.user?.id;
    console.log(landlordId);

    const result = await RentalHouseServices.getLandlordRentalHouses(
      landlordId,
      req.query
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Your rental house listings retrieved",
      data: result.result,
      meta: result.meta,
    });
  }
);

// Respond to a rental request (approve/reject)
const respondToRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { status, phoneNumber } = req.body;
    const userId = req?.user?.id;

    const result = await RentalHouseServices.respondToRentalRequestDB(
      requestId,
      status,
      userId,
      phoneNumber
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rental request responded to successfully",
      data: result,
    });
  }
);

// Export controller
export const RentalHouseControllers = {
  createRentalHouse,
  getAllRentalHouses,
  getSingleRentalHouse,
  updateRentalHouse,
  deleteRentalHouse,
  getLandlordRentalHouses,
  respondToRentalRequest,
};
