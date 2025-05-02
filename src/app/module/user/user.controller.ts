import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await userService.createUser(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await userService.getUser();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users getting successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  // console.log(req.params); 
  const userId = req.params.userId;

  const result = await userService.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User getting successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;
  const result = await userService.updateUser(userId, body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  await userService.deleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "user deleted successfully",
    data: {},
  });
});

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
