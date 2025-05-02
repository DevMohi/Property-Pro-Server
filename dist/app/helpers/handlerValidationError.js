"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleValidationError = (err, res) => {
    const issues = Object.values(err.errors).map((item) => {
        return {
            name: item.name,
            path: item.path,
            message: item.message
        };
    });
    res.status(400).json({
        success: false,
        message: err.message,
        issues: issues,
        error: err
    });
};
exports.handleValidationError = handleValidationError;
