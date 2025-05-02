import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";

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
    message: "User delete successfully",
    data: result,
  });
});

 
export const adminController = {
  getAllHousesByAdmin,
  getAllUsersByAdmin,
  userDeleteByAdmin,
};
