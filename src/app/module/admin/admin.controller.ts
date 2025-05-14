import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import AppError from "../../helpers/error";

const getAllHousesByAdmin = catchAsync(async (req, res) => {
  const houses = await adminService.getAllHouses();

  if (!houses || houses.length === 0) {
    throw new Error("No houses found");
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Houses retrieved successfully",
    data: houses,
  });
});
const getAllUsersByAdmin = catchAsync(async (req, res) => {
  const users = await adminService.getAllUsers();

  if (!users || users.length === 0) {
    throw new Error("No users found");
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: users,
  });
});

//All orders
const getAllRentalRequests = catchAsync(async (req, res) => {
  const result = await adminService.getAllRentalRequests();
  if (!result || result.length === 0) {
    throw new AppError(404, "No Rental Requests Found");
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental Requests retrieved successfully",
    data: result,
  });
});

const getAllRentalTransactions = catchAsync(async (req, res) => {
  const result = await adminService.getAllRentalTransactions();
  if (!result || result.length === 0) {
    throw new AppError(404, "No Rental Transaction Found");
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All Rental Transaction Retrieved Successfully",
    data: result,
  });
});

const userDeleteByAdmin = catchAsync(async (req, res) => {
  const userId = req.params.id;
  // console.log("userId", userId);
  const result = await adminService.deleteUserByAdmin(userId);

  if (!result) {
    throw new Error("User not found");
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data: result,
  });
});

export const adminController = {
  getAllHousesByAdmin,
  getAllUsersByAdmin,
  getAllRentalRequests,
  getAllRentalTransactions,
  userDeleteByAdmin,
};
