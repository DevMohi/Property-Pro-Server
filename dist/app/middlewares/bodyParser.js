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
exports.parseBody = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const error_1 = __importDefault(require("../helpers/error"));
exports.parseBody = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please provide data in the body under data key");
    }
    req.body = JSON.parse(req.body.data);
    next();
}));
// import { StatusCodes } from "http-status-codes";
// import catchAsync from "../utils/catchAsync";
// import { NextFunction, Request, Response } from "express";
// import AppError from "../helpers/error";
// export const parseBody = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.body.data) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Please provide data in the body under the 'data' key.");
//     }
//     try {
//         const parsedData = JSON.parse(req.body.data);
//         req.body = { ...req.body, ...parsedData }; // ✅ Merge parsed data with existing fields
//     } catch (error) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "Invalid JSON format in 'data' key.");
//     }
//     next();
// });
