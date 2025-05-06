import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RentalRequestService } from "./rentalRequest.service";

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id;
  const data = {
    ...req.body,
    tenantId,
  };

  const result = await RentalRequestService.createRentalRequest(data);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id;
  const result = await RentalRequestService.getRequestsByTenant(tenantId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved your rental requests",
    data: result,
  });
});

const getAllRequests = catchAsync(async (_req: Request, res: Response) => {
  const result = await RentalRequestService.getAllRequests();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved all rental requests",
    data: result,
  });
});

export const RentalRequestController = {
  createRequest,
  getMyRequests,
  getAllRequests,
};
