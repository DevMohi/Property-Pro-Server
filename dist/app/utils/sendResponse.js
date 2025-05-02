"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        status: true,
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        token: data.token,
        data: data.data,
    });
};
exports.default = sendResponse;
