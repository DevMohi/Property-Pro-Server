/* eslint-disable no-console */
import { Request, Response } from "express";
import { ProductServices } from "./rentalHouse.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IImageFiles } from "../../middlewares/interface/IImageFile";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id;
  // console.log(landlordId);

  const productData = { ...req.body, LandlordID: landlordId };

  const result = await ProductServices.createProductIntoDB(
    productData,
    req.files as IImageFiles
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listings created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (_req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listings retrieved successfully",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductFromDB(productId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id;
  const productId = req.params.id;

  const updatedData = { ...req.body, LandlordID: landlordId };

  const result = await ProductServices.updateProductInDB(
    productId,
    updatedData
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing updated successfully",
    data: result,
  });
});

// const updateProduct = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const productId = req.params.productId;
//     const images = req.files as IImageFiles;
//     const data = { ...req.body, images };

//     const result = await ProductServices.updateProductInDB(productId, data);

//     if (!result) {
//       res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: result,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update Product",
//     });
//   }
// };

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const result = await ProductServices.deleteProductFromDB(productId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete Product",
    });
  }
};

const respondToRentalRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  // console.log(requestId);
  const { status, phoneNumber } = req.body;
  const userId = req?.user?.id;

  const result = await ProductServices.respondToRentalRequestDB(
    requestId,
    status,
    userId,
    phoneNumber
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Rental Request responded successfully",
    data: result,
  });
});

const getLandlordPostings = catchAsync(async (req, res) => {
  const landlordId = req.user?.id; // from auth middleware

  const result = await ProductServices.getLandlordListings(landlordId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrieved your postings",
    data: result,
    // data: null,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getLandlordPostings,
  respondToRentalRequest,
};
