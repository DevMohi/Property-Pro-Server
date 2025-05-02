"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const globalErrorHandler_1 = require("../../middlewares/globalErrorHandler");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthControllers.register);
authRouter.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.login);
authRouter.post("/change-password", (0, auth_1.default)("admin", "tenant", "landlord"), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
authRouter.post("/refresh-token", auth_controller_1.AuthControllers.refreshToken);
authRouter.use(globalErrorHandler_1.globalErrorHandler);
exports.default = authRouter;
