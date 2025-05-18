import { query } from "express";
import QueryBuilder from "../../builder/querybuilder";
import { RentalTransactionModel } from "../order/order.model";
import { RentalHouseModel } from "../rentalHouse/rentalHouse.model";
import User from "../user/user.model";

const getAllHouses = async () => {
  const result = await RentalHouseModel.find();
  return result;
};
const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query).paginate();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return{
    meta, result
  }
};

const getAllRentalTransactions = async () => {
  const result = await RentalTransactionModel.find();
  return result;
};

const deleteUserByAdmin = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

const userSummary = async () => {
  const houses = await RentalHouseModel.find();
  const users = await User.find();
  const tenant = await User.find({ role: "tenant" });
  const landlord = await User.find({ role: "landlord" });

  return {
    houses: houses.length,
    users: users.length,
    tenants: tenant.length,
    landlord: landlord.length,
  };
};

export const adminService = {
  getAllHouses,
  getAllUsers,
  userSummary,
  getAllRentalTransactions,
  deleteUserByAdmin,
};
