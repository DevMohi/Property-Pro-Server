import { USER_ROLE } from "./user.constants";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "tenant" | "landlord";
  address: string;
  city: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
