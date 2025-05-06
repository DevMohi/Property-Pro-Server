// order.service.ts (Rental Transaction)
import { JwtPayload } from "jsonwebtoken";
import { RentalRequestModel } from "../rentalRequest/rentalRequest.model";
import AppError from "../../helpers/error";
import { RentalHouseModel } from "../rentalHouse/rentalHouse.model";
import User from "../user/user.model";

import { OrderUtils } from "./order.utils";
import { RentalTransactionModel } from "./order.model";

const createRentalTransactionIntoDB = async (
  rentalRequestId: string,
  userInfo: JwtPayload,
  client_ip: string
) => {
  const rentalRequest = await RentalRequestModel.findById(rentalRequestId);
  if (!rentalRequest) throw new AppError(404, "Rental request not found");

  const tenant = await User.findById(rentalRequest.tenantId);
  if (!tenant) throw new AppError(400, "No tenant found");

  const rentalHouse = await RentalHouseModel.findById(
    rentalRequest.rentalHouseId
  );
  if (!rentalHouse) throw new AppError(404, "Rental house not found");

  const existingTransaction = await RentalTransactionModel.findOne({
    rentalRequestId: rentalRequest._id,
    tenantId: tenant._id,
    rentalHouseId: rentalHouse._id,
  });

  if (existingTransaction) {
    if (existingTransaction.status === "Paid") {
      throw new AppError(400, "This rental has already been paid for");
    } else if (
      existingTransaction.status === "Cancelled" ||
      existingTransaction.status === "Pending"
    ) {
      await RentalTransactionModel.deleteOne({ _id: existingTransaction._id });
    } else {
      throw new AppError(
        400,
        "You already have a pending transaction for this request"
      );
    }
  }

  if (rentalHouse.houseStatus === "rented") {
    throw new AppError(400, "The listing is already rented");
  }

  const user = await User.findOne({ email: userInfo.email });
  const landlord = await User.findById(rentalHouse.landlordId);
  if (!landlord) throw new AppError(404, "Landlord not found");

  const amount = Number(rentalHouse.rent);

  let order = await RentalTransactionModel.create({
    rentalRequestId: rentalRequest._id,
    tenantId: tenant._id,
    rentalHouseId: rentalHouse._id,
    landlordId: landlord._id,
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

  const payment = await OrderUtils.makePaymentAsync(paymentPayload);

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

  if (verifiedPayment[0].sp_code === "1011") {
    throw new AppError(404, "Order not found!");
  }

  if (verifiedPayment.length) {
    const updatedTransaction = await RentalTransactionModel.findOneAndUpdate(
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
          verifiedPayment[0].bank_status === "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status === "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status === "Cancel"
            ? "Cancelled"
            : "",
      },
      { new: true }
    );

    if (!updatedTransaction) {
      throw new AppError(404, "Transaction not found");
    }

    if (updatedTransaction?.transaction?.bank_status === "Success") {
      await RentalHouseModel.findByIdAndUpdate(
        updatedTransaction.rentalHouseId,
        {
          houseStatus: "rented",
        }
      );
      await RentalRequestModel.findByIdAndUpdate(
        updatedTransaction.rentalRequestId,
        {
          paymentStatus: "Paid",
        }
      );
    }
  }

  return verifiedPayment;
};

const getTenantOrdersFromDB = async (email: string) => {
  const tenant = await User.findOne({ email });
  return await RentalTransactionModel.find({ tenantId: tenant?._id })
    .populate("tenantId")
    .populate("rentalHouseId")
    .populate("landlordId");
};

const getAllRentalOrdersFromDB = async () => {
  return await RentalTransactionModel.find()
    .populate("tenantId")
    .populate("rentalHouseId")
    .populate("landlordId");
};

const cancelRentalOrderFromDB = async (orderId: string, userId: string) => {
  const order = await RentalTransactionModel.findById(orderId);

  if (!order) {
    throw new AppError(404, "Order not found or deleted");
  }

  if (String(order.tenantId) !== String(userId)) {
    throw new AppError(403, "You are not authorized to cancel this order");
  }

  if (order.status === "Paid") {
    throw new AppError(400, "Paid orders cannot be cancelled");
  }

  await RentalTransactionModel.findByIdAndDelete(orderId);
  await RentalHouseModel.findByIdAndUpdate(order.rentalHouseId, {
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
