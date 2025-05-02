import { ProductModel } from "../rentalHouse/rentalHouse.model";
import User from "../user/user.model";

const getAllHouses = async () => {
  const result = await ProductModel.find();
  return result;
};
const getAllUsers = async () => {
  const result = await User.find();
  return result;
};
const deleteUserByAdmin = async (userId: string) => { 
  const result = await User.findByIdAndDelete(userId);
  return result;
};
 


export const adminService = {
  getAllHouses,
  getAllUsers,
  deleteUserByAdmin, 
};
