"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const handleCustomError_1 = require("../helpers/handleCustomError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleCastError_1 = require("../helpers/handleCastError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleGenericError_1 = require("../helpers/handleGenericError");
const globalErrorHandler = (err, req, res, _next) => {
    let response = {
        success: false,
        message: "An unexpected error occurred",
        statusCode: 500,
        error: null,
    };
    if (err instanceof handleCustomError_1.CustomError) {
        response = {
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            error: err.details || null,
            stack: err.stack,
        };
        res.status(err.statusCode).json(response);
    }
    else if (err.name && err.name === "ZodError") {
        (0, handleZodError_1.handlerZodError)(err, res);
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        (0, handleCastError_1.handleCastError)(err, res);
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        (0, handlerValidationError_1.handleValidationError)(err, res);
    }
    else if (err.code && err.code === 11000) {
        (0, handleDuplicateError_1.handlerDuplicateError)(err, res);
    }
    else if (err instanceof Error) {
        (0, handleGenericError_1.handleGenericError)(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
