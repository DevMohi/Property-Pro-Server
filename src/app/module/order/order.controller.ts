import AppError from "../../helpers/error";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RentalServices } from "./order.service";

// POST /order/rental-payment
const makeRentalPayment = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized: User not found in request");
  }

  const { rentalRequestId } = req.body;
  const result = await RentalServices.createRentalTransactionIntoDB(
    rentalRequestId,
    req.user,
    req.ip as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rental payment initiated successfully",
    data: result,
  });
});

// GET /order/verify?orderId=...
const paymentVerify = catchAsync(async (req, res) => {
  const { orderId } = req.query;
  const result = await RentalServices.verifyPayment(orderId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order verified successfully",
    data: result,
  });
});

// GET /order/my-order
const getTenantOrders = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const result = await RentalServices.getTenantOrdersFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your rental transactions retrieved successfully",
    data: result,
  });
});

// GET /order/all-orders (admin)
const getAllRentalOrders = catchAsync(async (_req, res) => {
  const result = await RentalServices.getAllRentalOrdersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All rental transactions retrieved successfully",
    data: result,
  });
});

// DELETE /order/cancel-order/:id
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

export const RentalTransactionControllers = {
  makeRentalPayment,
  paymentVerify,
  getTenantOrders,
  getAllRentalOrders,
  cancelRentalOrder,
};
