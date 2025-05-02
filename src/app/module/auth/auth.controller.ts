import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../helpers/error";

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: true,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => { 
  const result = await AuthService.login(req.body);
  const { refreshToken } = result;  

  res.cookie("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.ACCEPTED,
    status: true,
    success: true,
    message: "Login successful",
    data: {
      token: result?.accessToken || "",
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized. User not found in request.");
  }
  const { ...passwordData } = req.body;
  const result = await AuthService.changePassword(req.user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password Changed Successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  // console.log("Cookies", refreshToken); 
  const result = await AuthService.regenerateAcessToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "New Access token is retrieved successfully!",
    data: result,
  });
});

export const AuthControllers = {
  register,
  login,
  changePassword,
  refreshToken,
};
