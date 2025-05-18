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
  const users = await adminService.getAllUsers(req.query);

  if (!users) {
    throw new Error("No users found");
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: users.result,
    meta: users.meta,
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

const userSummary = catchAsync(async (req, res) => {
  const result = await adminService.userSummary();
  if (!result) {
    throw new AppError(404, "No Summary Found");
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User Summary Retrieved Successfully",
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
  userSummary,
  getAllRentalTransactions,
  userDeleteByAdmin,
};
