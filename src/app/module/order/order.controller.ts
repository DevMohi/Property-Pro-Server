// import { RequestHandler } from "express";
// import { createRentalTransaction } from "./rentalTransaction.service";
// import catchAsync from "../../utils/catchAsync";

import AppError from "../../helpers/error";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { RentalServices } from "./order.service";

//   const tenantId = req.params.tenantId;
//   const user = req.user;
//   const client_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

//   const checkoutUrl = await createRentalTransaction(tenantId, user, client_ip as string);

//   res.status(200).json({
//     success: true,
//     message: "Redirect to ShurjoPay",
//     data: checkoutUrl,
//   });
// });

const makeRentalPayment = catchAsync(async (req, res) => {
  // console.log(req.body); 
  if (!req.user) {
    throw new AppError(401, "Unauthorized: User not found in request");
  }
  const { tenantRequest } = req.body;
  const result = await RentalServices.createRentalTransactionIntoDB(
    tenantRequest,
    req.user,
    req.ip as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Renting Payment Intitiated Successfully",
    data: result,
    // data: result,
  });
});

// Order Verify Controllers
const rentalVerify = catchAsync(async (req, res) => {
  // console.log(req?.query?.id); 
  const result = await RentalServices.verifyPayment(
    req.query.orderId as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order Verified Successful",
    data: result,
  });
});

const getTenantOrders = catchAsync(async (req, res) => {
  const result = await RentalServices.getTenantOrdersFromDB(req?.user?.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your orders that have been paid or ordered recieved successfully",
    data: result,
  });
});

//For admin too see
const getAllRentalOrders = catchAsync(async (req, res) => {
  const result = await RentalServices.getAllRentalOrdersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Rental Orders Retrieved Successfully",
    data: result,
  });
});

const cancelRentalOrder = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const userId = req?.user?.id;

  const result = await RentalServices.cancelRentalOrderFromDB(orderId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental order cancelled successfully",
    data: result,
  });
});

export const RentalControllers = {
  makeRentalPayment,
  rentalVerify,
  getTenantOrders,
  getAllRentalOrders,
  cancelRentalOrder,
};
