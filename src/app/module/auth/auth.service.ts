import { CustomError } from "../../helpers/handleCustomError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import {
  createToken,
  isPasswordMatched,
  isUserExistByEmail,
  verifyToken,
} from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../helpers/error";
import config from "../../config";

const register = async (payload: IUser) => {
  const result = await User.create(payload);
  if (!result) {
    throw new CustomError("Failed to create user", 500);
  }
  return result;
};

const login = async (payload: { email: string; password: string }) => {
 
  const user = await User.findOne({ email: payload?.email }).select(
    "+password"
  ); 
  if (!user) {
    throw new CustomError("This user is not found!", 404, { field: "email" });
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatched) {
    throw new CustomError("Invalid credentials", 401, { field: "password" });
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id.toString(),
  };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_EXPIRES_IN as string
  ); 
  const refreshToken = createToken(
    jwtPayload,
    process.env.jwt_refresh_secret as string,
    process.env.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken, user };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await isUserExistByEmail(userData.email);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  // console.log(payload.oldPassword, user?.password); 

  if (!(await isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(409, "Password not matched");
  }

  //jodi hoie jai hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    }
  );
};

// Generate new access token with an existing refresh token that is about to be expired

const regenerateAcessToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, process.env.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await isUserExistByEmail(email);

  if (!user) {
    throw new AppError(404, "This user is not found !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id.toString(),
  };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_EXPIRES_IN as string
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  register,
  login,
  changePassword,
  regenerateAcessToken,
};
