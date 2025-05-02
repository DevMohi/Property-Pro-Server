// import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../helpers/error";
// import { ProductModel } from "../rentalHouse/rentalHouse.model";
// import { Tenant } from "../tenant/tenant.model";
// import User from "../user/user.model";
// import { TRentalTransaction } from "./order.interface";
// import { RentalTransaction } from "./order.model";

import { JwtPayload } from "jsonwebtoken";
import { Tenant } from "../tenant/tenant.model";
import AppError from "../../helpers/error";
import { ProductModel } from "../rentalHouse/rentalHouse.model";
import User from "../user/user.model";
import { RentalTransaction } from "./order.model";
import { OrderUtils } from "./order.utils";

const createRentalTransactionIntoDB = async (
  tenantId: string,
  userInfo: JwtPayload,
  client_ip: string
) => {
  // console.log(client_ip); 
  const tenantRequest = await Tenant.findById(tenantId).populate("products");
  // console.log(tenantRequest);  
  if (!tenantRequest) throw new AppError(404, "Rental request not found");

  // console.log(tenantRequest);

  const tenant = await User.findOne(tenantRequest?.tenant);

  if (!tenant) {
    throw new AppError(400, "No tenant found");
  }
  const product = await ProductModel.findById(tenantRequest.products);

  const existingTransaction = await RentalTransaction.findOne({
    tenantRequest: tenantRequest._id,
    tenant: tenant._id,
    product: product?._id,
  });

  // if (existingTransaction) {
  //   if (existingTransaction.status === "Paid" ) {
  //     throw new AppError(400, "This rental has already been paid for");
  //   } else {
  //     throw new AppError(
  //       400,
  //       "You already have a pending transaction for this request"
  //     );
  //   }
  // }

  if (existingTransaction) {
    if (existingTransaction?.status === "Paid") {
      throw new AppError(400, "This rental has already been paid for");
    } else if (
      existingTransaction?.status === "Cancelled" ||
      existingTransaction?.status === "Pending"
    ) {
      await RentalTransaction.deleteOne({ _id: existingTransaction._id });
    } else {
      throw new AppError(
        400,
        "You already have a pending transaction for this request"
      );
    }
  }

  if (product?.houseStatus === "rented") {
    throw new AppError(400, "The listing is already rented");
  }

  const user = await User.findOne({ email: userInfo.email });
  // console.log("user", userName?.name);

  if (!product) throw new AppError(404, "Product not found");

  const landlord = await User.findById(product.LandlordID);
  if (!landlord) throw new AppError(404, "Landlord not found");

  // console.log("Inside user", userInfo);

  const amount = Number(product.rent);

  let order = await RentalTransaction.create({
    tenantRequest: tenantRequest._id,
    tenant: tenant._id,
    product: product._id,
    landlord: landlord._id,
    amount,
  });

  const paymentPayload = {
    amount,
    order_id: order._id,
    currency: "BDT",
    customer_name: user?.name,
    customer_email: user?.email,
    customer_phone: user?.phone,
    customer_address: user?.address,
    customer_city: user?.city,
    client_ip,
  };
  // console.log(transaction);
  // console.log(paymentPayload);

  const payment = await OrderUtils.makePaymentAsync(paymentPayload);
  // console.log(payment);

  // if ((payment as any)?.transactionStatus) {
  //   order = await order.updateOne({
  //     transaction: {
  //       id: (payment as any)?.sp_order_id,
  //       transaction_status: (payment as any)?.transactionStatus,
  //       checkout_url: (payment as any)?.checkout_url,
  //     },
  //   });
  // }
  if ((payment as any)?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: (payment as any)?.sp_order_id,
        transaction_status: (payment as any)?.transactionStatus,
        checkout_url: (payment as any)?.checkout_url,
      },
    });
  }

  return (payment as any)?.checkout_url;
};

const verifyPayment = async (orderId: string) => {
  const verifiedPayment = await OrderUtils.verifyPaymentAsync(orderId);
  // console.log(verifiedPayment[0].sp_code); 
  if (verifiedPayment[0].sp_code === "1011") {
    throw new AppError(404, "Order not found!");
  }
  if (verifiedPayment.length) {
    const updatedTransaction = await RentalTransaction.findOneAndUpdate(
      {
        "transaction.id": orderId,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "Cancelled"
            : "",
      },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new AppError(404, "Transaction not found");
    }

    if (updatedTransaction?.transaction?.bank_status === "Success") {
      await ProductModel.findByIdAndUpdate(updatedTransaction.product, {
        houseStatus: "rented",
      });
      await Tenant.findByIdAndUpdate(updatedTransaction.tenantRequest, {
        paymentStatus: "Paid",
      });
    }
  }

  return verifiedPayment;
};

const getTenantOrdersFromDB = async (email: string) => {
  const tenant = await User.findOne({ email });
  // console.log("tenant", tenant); 
  const result = await RentalTransaction.find({ tenant: tenant?._id })
    .populate("tenant")
    .populate("product");
  return result;
};

const getAllRentalOrdersFromDB = async () => {
  const result = await RentalTransaction.find()
    .populate("tenant")
    .populate("product")
    .populate("landlord");
  return result;
};

const cancelRentalOrderFromDB = async (orderId: string, userId: string) => {
  const order = await RentalTransaction.findById(orderId);

  if (!order) {
    throw new AppError(404, "Order not found or deleted");
  }
  // console.log(order.tenant, userId); 

  // Ensure only the correct tenant can cancel
  if (String(order.tenant) !== String(userId)) {
    throw new AppError(403, "You are not authorized to cancel this order");
  }

  if (order.status === "Paid") {
    throw new AppError(400, "Paid orders cannot be cancelled");
  }

  await RentalTransaction.findByIdAndDelete(orderId);

  // Optionally revert houseStatus
  await ProductModel.findByIdAndUpdate(order.product, {
    houseStatus: "available",
  });

  return true;
};

export const RentalServices = {
  createRentalTransactionIntoDB,
  verifyPayment,
  getTenantOrdersFromDB,
  getAllRentalOrdersFromDB,
  cancelRentalOrderFromDB,
};
