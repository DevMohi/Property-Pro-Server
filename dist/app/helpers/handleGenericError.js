"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenericError = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleGenericError = (err, res) => {
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
        error: err
    });
};
exports.handleGenericError = handleGenericError;
