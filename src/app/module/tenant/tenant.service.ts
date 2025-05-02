import AppError from "../../helpers/error";
import { ProductModel } from "../rentalHouse/rentalHouse.model";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import { ITenant } from "./tenant.interface";

import { Tenant } from "./tenant.model";

//New rental request for a house
const createTenantRequestIntoDB = async (data: ITenant) => {
  const { tenant, products: productId } = data;

  // Check if the tenant has already requested this product
  const existingRequest = await Tenant.findOne({
    tenant,
    products: productId,
  });

  if (existingRequest) {
    throw new AppError(
      400,
      "You have already submitted a request for this property."
    );
  }

  // Create a new rental request
  const result = await Tenant.create(data);
  return result;
};

const getTenantRequestsFromDB = async (tenantId: string) => {
  const result = await Tenant.find({ tenant: tenantId }).populate("products");
  return result;
};

const updateTenantProfileDB = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getAllRentalRequestsForLandlordFromDB = async (landlordId: string) => {
  const products = await ProductModel.find({}).select("LandlordID");
  // console.log(products);

  const result = await Tenant.find()
    .populate({
      path: "products",
      match: { LandlordID: landlordId },
    })
    .populate("tenant");

  // Filter out requests where products didn't match (i.e., landlord didn't own it)
  const filtered = result.filter((req) => req.products !== null);

  return filtered;
};

export const TenantService = {
  createTenantRequestIntoDB,
  getTenantRequestsFromDB,
  updateTenantProfileDB,
  getAllRentalRequestsForLandlordFromDB,
};
