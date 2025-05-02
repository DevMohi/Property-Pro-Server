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
exports.AuthService = void 0;
const handleCustomError_1 = require("../../helpers/handleCustomError");
const user_model_1 = __importDefault(require("../user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const error_1 = __importDefault(require("../../helpers/error"));
const config_1 = __importDefault(require("../../config"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.create(payload);
    if (!result) {
        throw new handleCustomError_1.CustomError("Failed to create user", 500);
    }
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select("+password");
    if (!user) {
        throw new handleCustomError_1.CustomError("This user is not found!", 404, { field: "email" });
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new handleCustomError_1.CustomError("Invalid credentials", 401, { field: "password" });
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id.toString(),
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, process.env.JWT_ACCESS_SECRET, process.env.JWT_EXPIRES_IN);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, process.env.jwt_refresh_secret, process.env.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_utils_1.isUserExistByEmail)(userData.email);
    if (!user) {
        throw new error_1.default(404, "User Not Found");
    }
    // console.log(payload.oldPassword, user?.password); 
    if (!(yield (0, auth_utils_1.isPasswordMatched)(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new error_1.default(409, "Password not matched");
    }
    //jodi hoie jai hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.default.findOneAndUpdate({
        email: userData.email,
        role: userData.role,
    }, {
        password: newHashedPassword,
    });
});
// Generate new access token with an existing refresh token that is about to be expired
const regenerateAcessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, process.env.jwt_refresh_secret);
    const { email } = decoded;
    // checking if the user is exist
    const user = yield (0, auth_utils_1.isUserExistByEmail)(email);
    if (!user) {
        throw new error_1.default(404, "This user is not found !");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id.toString(),
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, process.env.JWT_ACCESS_SECRET, process.env.JWT_EXPIRES_IN);
    return {
        accessToken,
    };
});
exports.AuthService = {
    register,
    login,
    changePassword,
    regenerateAcessToken,
};
