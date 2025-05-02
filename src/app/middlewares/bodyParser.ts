import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/error";

export const parseBody = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.data) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please provide data in the body under data key"
      );
    }
    req.body = JSON.parse(req.body.data);

    next();
  }
);
// import { StatusCodes } from "http-status-codes";
// import catchAsync from "../utils/catchAsync";
// import { NextFunction, Request, Response } from "express";
// import AppError from "../helpers/error";

// export const parseBody = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.body.data) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Please provide data in the body under the 'data' key.");
//     }

//     try {
//         const parsedData = JSON.parse(req.body.data);
//         req.body = { ...req.body, ...parsedData }; // ✅ Merge parsed data with existing fields
//     } catch (error) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Invalid JSON format in 'data' key.");
//     }

//     next();
// });
