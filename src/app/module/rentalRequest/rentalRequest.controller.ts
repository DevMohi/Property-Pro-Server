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
  const result = await RentalRequestService.getRequestsByTenant(
    tenantId,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved your rental requests",
    meta: result.meta,
    data: result.result,
  });
});

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalRequestService.getAllRequests(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved all rental requests",
    data: result.result,
    meta: result.meta,
  });
});

//Individual all requests
const getRequestsForLandlord = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;

  const result = await RentalRequestService.getAllRequestsForLandlord(
    landlordId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      "All tenant requests for your rental listings retrieved successfully",
    data: result,
  });
});

export const RentalRequestController = {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestsForLandlord,
};
