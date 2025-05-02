import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { TUserRole } from "../user/user.interface";
import User from "../user/user.model";
import bcrypt from "bcrypt";

export const createToken = (
  jwtPayload: { email: string; role: TUserRole },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const isUserExistByEmail = async function (email: string) {
  //select kortesi because doc theke remove korsilam
  return await User.findOne({ email }).select("+password");
};

//Check if password correct
export const isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
