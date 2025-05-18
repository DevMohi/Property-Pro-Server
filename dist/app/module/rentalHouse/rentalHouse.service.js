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
exports.RentalHouseServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rentalHouse_model_1 = require("./rentalHouse.model");
const error_1 = __importDefault(require("../../helpers/error"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../user/user.model"));
const rentalRequest_model_1 = require("../rentalRequest/rentalRequest.model");
const querybuilder_1 = __importDefault(require("../../builder/querybuilder"));
// Create a new rental house listing
const createRentalHouseInDB = (rentalHouseData, imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const { images } = imageFiles;
    if (!images || images.length === 0) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Images are required.");
    }
    rentalHouseData.imageUrls = images.map((image) => image.path);
    const result = yield rentalHouse_model_1.RentalHouseModel.create(rentalHouseData);
    return result;
});
const getAllRentalHousesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalHouseQuery = new querybuilder_1.default(rentalHouse_model_1.RentalHouseModel.find(), query).paginate();
    const result = yield rentalHouseQuery.modelQuery;
    const meta = yield rentalHouseQuery.countTotal();
    return {
        meta,
        result,
    };
});
const getLandlordRentalHouses = (landlordId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_model_1.RentalHouseModel.find({ landlordId }).populate("landlordId");
    return result;
});
// const getLandlordRentalHouses = async (
//   landlordId: string,
//   query: Record<string, unknown>
// ) => {
//   const rentalHouseQuery = new QueryBuilder(
//     RentalHouseModel.find({ landlordId }),
//     query
//   ).paginate();
//   const result = await rentalHouseQuery.modelQuery.populate("landlordId");
//   const meta = await rentalHouseQuery.countTotal();
//   return { result, meta };
// };
const getSingleRentalHouseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    const result = yield rentalHouse_model_1.RentalHouseModel.findById(id).populate("landlordId");
    return result;
});
// Update listing by ID
const updateRentalHouseInDB = (rentalHouseId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalHouse_model_1.RentalHouseModel.findByIdAndUpdate(rentalHouseId, updatedData, { new: true, runValidators: true });
    if (!result) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rental house not found");
    }
    return result;
});
// Delete a listing by ID
const deleteRentalHouseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return null; // If the ID is not valid, return null
    }
    // Use findByIdAndDelete to delete by ID
    const deletedRentalHouse = yield rentalHouse_model_1.RentalHouseModel.findByIdAndDelete(id);
    return deletedRentalHouse; // Will return null if not found, or the deleted house data
});
// Respond to a rental request (approve/reject)
const respondToRentalRequestDB = (requestId, status, userId, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalRequest = yield rentalRequest_model_1.RentalRequestModel.findById(requestId);
    if (!rentalRequest) {
        throw new error_1.default(400, "Rental request not found");
    }
    const rentalHouse = yield rentalHouse_model_1.RentalHouseModel.findById(rentalRequest.rentalHouseId);
    if (!rentalHouse) {
        throw new error_1.default(400, "Rental house not found");
    }
    const landlord = yield user_model_1.default.findById(rentalHouse.landlordId);
    if (!landlord) {
        throw new error_1.default(400, "Landlord not found");
    }
    // Authorization check: only the actual landlord can respond
    if (String(rentalHouse.landlordId) !== String(userId)) {
        throw new error_1.default(403, "You are not authorized to respond to this request");
    }
    const finalPhoneNumber = landlord.phone || phoneNumber;
    if (status === "Approved" && !finalPhoneNumber) {
        throw new error_1.default(400, "Phone number is required to approve this request");
    }
    rentalRequest.status = status;
    if (status === "Approved") {
        rentalRequest.phone = finalPhoneNumber;
    }
    yield rentalRequest.save();
    return rentalRequest;
});
exports.RentalHouseServices = {
    createRentalHouseInDB,
    getAllRentalHousesFromDB,
    getSingleRentalHouseFromDB,
    updateRentalHouseInDB,
    deleteRentalHouseFromDB,
    getLandlordRentalHouses,
    respondToRentalRequestDB,
};
