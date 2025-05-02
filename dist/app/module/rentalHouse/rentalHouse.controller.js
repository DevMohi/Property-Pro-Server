"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const rentalHouse_service_1 = require("./rentalHouse.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    // console.log(landlordId);
    const productData = Object.assign(Object.assign({}, req.body), { LandlordID: landlordId });
    const result = yield rentalHouse_service_1.ProductServices.createProductIntoDB(productData, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Listings created successfully",
        data: result,
    });
}));
const getAllProducts = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_service_1.ProductServices.getAllProductsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Listings retrieved successfully",
        data: result,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield rentalHouse_service_1.ProductServices.getSingleProductFromDB(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Listing retrieved successfully",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const productId = req.params.id;
    const updatedData = Object.assign(Object.assign({}, req.body), { LandlordID: landlordId });
    const result = yield rentalHouse_service_1.ProductServices.updateProductInDB(productId, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Listing updated successfully",
        data: result,
    });
}));
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
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield rentalHouse_service_1.ProductServices.deleteProductFromDB(productId);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to delete Product",
        });
    }
});
const respondToRentalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { requestId } = req.params;
    // console.log(requestId);
    const { status, phoneNumber } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield rentalHouse_service_1.ProductServices.respondToRentalRequestDB(requestId, status, userId, phoneNumber);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Rental Request responded successfully",
        data: result,
    });
}));
const getLandlordPostings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
    const result = yield rentalHouse_service_1.ProductServices.getLandlordListings(landlordId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Retrieved your postings",
        data: result,
        // data: null,
    });
}));
exports.ProductControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getLandlordPostings,
    respondToRentalRequest,
};
