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
exports.ProductServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rentalHouse_model_1 = require("./rentalHouse.model");
const error_1 = __importDefault(require("../../helpers/error"));
const http_status_codes_1 = require("http-status-codes");
const tenant_model_1 = require("../tenant/tenant.model");
const user_model_1 = __importDefault(require("../user/user.model"));
// Create a new product
const createProductIntoDB = (productData, productImages) => __awaiter(void 0, void 0, void 0, function* () {
    const { images } = productImages;
    if (!images || images.length === 0) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product images are required.");
    }
    productData.imageUrls = images.map((image) => image.path);
    const result = yield rentalHouse_model_1.ProductModel.create(productData);
    return result;
});
// Get all products
const getAllProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_model_1.ProductModel.find();
    return result;
});
// Get single product following by id
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return null;
    }
    const result = yield rentalHouse_model_1.ProductModel.findById(id);
    return result;
});
// Update a product by ID
// const updateProductInDB = async (id: string, data: TProduct) => {
//   // Only run the mapping logic if user updated image data
//   if (Array.isArray(data?.images?.images) && data.images?.images?.length > 0) {
//     const picData = data.images.images;
//     const pic = picData.map((image) => image?.path);
//     data.imageUrls = pic;
//   }
//   const result = await ProductModel.findByIdAndUpdate(id, data, { new: true });
//   return result;
// };
const updateProductInDB = (productId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle new file uploads (if any)
    // if (files) {
    //   if (files.images && Array.isArray(files.images)) {
    //     updatedData.images = files.images.map(
    //       (file) => (file as Express.Multer.File).path
    //     );
    //   }
    //   if (files.thumbnail && Array.isArray(files.thumbnail)) {
    //     // If you have thumbnail logic — otherwise ignore this
    //     const thumbnailPath = (files.thumbnail[0] as Express.Multer.File).path;
    //     // optionally: updatedData.thumbnail = thumbnailPath;
    //     // But your TProduct does not include thumbnail
    //   }
    // }
    const updatedProduct = yield rentalHouse_model_1.ProductModel.findByIdAndUpdate(productId, updatedData, {
        new: true, // return the updated doc
        runValidators: true,
    });
    if (!updatedProduct) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found");
    }
    return updatedProduct;
});
//respond to requests
const respondToRentalRequestDB = (requestId, status, userId, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield tenant_model_1.Tenant.findById(requestId);
    if (!request) {
        throw new error_1.default(400, "Tenant Request Not found");
    }
    const product = yield rentalHouse_model_1.ProductModel.findById(request.products);
    if (!product) {
        throw new error_1.default(400, "Product Not found");
    }
    const landlord = yield user_model_1.default.findById(product.LandlordID);
    if (!landlord) {
        throw new error_1.default(400, "User Not found");
    }
    // console.log(product.LandlordID.toString(), userId);
    if (product.LandlordID.toString() !== userId) {
        // console.log("Inside here");
        throw new error_1.default(400, "You are not authorized to respond to this request");
    }
    // If status is "Approved", check if the landlord's phone number is provided
    const landlordPhone = landlord.phone || phoneNumber;
    if (status === "Approved") {
        if (!(landlord === null || landlord === void 0 ? void 0 : landlord.phone)) {
            if (!landlordPhone) {
                throw new error_1.default(404, "Phone number is required");
            }
            request.phone = landlordPhone;
        }
        else {
            request.phone = landlordPhone;
        }
    }
    else if (status === "Rejected") {
        request.phone = landlordPhone;
    }
    request.status = status; // Update the status to Approved/Rejected
    yield request.save(); // Save the changes
    return request;
});
//landlord can retrieve its own listings
const getLandlordListings = (landlordId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_model_1.ProductModel.find({ LandlordID: landlordId });
    return result;
});
// Delete a product by ID
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return null;
    }
    const result = yield rentalHouse_model_1.ProductModel.findOneAndDelete({ _id: id });
    return result;
});
//all service is exported from this function
exports.ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    updateProductInDB,
    getLandlordListings,
    respondToRentalRequestDB,
    deleteProductFromDB,
};
