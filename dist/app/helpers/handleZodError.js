"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (err, res) => {
    const response = {
        success: false,
        message: "Validation error",
        statusCode: 400,
        error: {
            details: err.errors.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        },
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
    res.status(400).json(response);
};
exports.handlerZodError = handlerZodError;
