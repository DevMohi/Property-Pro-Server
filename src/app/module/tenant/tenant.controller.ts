import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TenantService } from "./tenant.service";

const submitRequest = catchAsync(async (req, res) => {
  const tenantId = req.user?.id; // from auth middleware
  // console.log(tenantId); 
  const payload = { ...req.body, tenant: tenantId };
  const result = await TenantService.createTenantRequestIntoDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Rental Request submitted successfully",
    data: result,
  });
});

const getMyRequests = catchAsync(async (req, res) => {
  const tenantId = req.user?.id; // from auth middleware
  const result = await TenantService.getTenantRequestsFromDB(tenantId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved your rental requests",
    data: result,
  });
});

//done
const updateTenantProfile = catchAsync(async (req, res) => {
  const tenantId = req.user?.id;
  const { role, ...rest } = req.body; // Prevent role from being updated
  // console.log(tenantId, rest); 

  const result = await TenantService.updateTenantProfileDB(tenantId, rest);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tenant Profile Updated Successfully",
    data: result,
  });
});

const getRentalRequestsForLandlord = catchAsync(async (req, res) => {
  const landlordId = req.user?.id; // from auth middleware
  // console.log('landlord', landlordId); 
  const result = await TenantService.getAllRentalRequestsForLandlordFromDB(
    landlordId
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved rental requests for landlord",
    data: result,
  });
});

export const TenantController = {
  submitRequest,
  getMyRequests,
  updateTenantProfile,
  getRentalRequestsForLandlord,
};
