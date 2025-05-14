import { RentalTransactionModel } from "../order/order.model";
import { RentalHouseModel } from "../rentalHouse/rentalHouse.model";
import { RentalRequestModel } from "../rentalRequest/rentalRequest.model";
import User from "../user/user.model";

const getAllHouses = async () => {
  const result = await RentalHouseModel.find();
  return result;
};
const getAllUsers = async () => {
  const result = await User.find();
  return result;
};

const getAllRentalRequests = async () => {
  const result = await RentalRequestModel.find();
  return result;
};

const getAllRentalTransactions = async () => {
  const result = await RentalTransactionModel.find();
  return result;
};

const deleteUserByAdmin = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const adminService = {
  getAllHouses,
  getAllUsers,
  getAllRentalRequests,
  getAllRentalTransactions,
  deleteUserByAdmin,
};
