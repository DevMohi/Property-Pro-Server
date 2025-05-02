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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tenant_service_1 = require("./tenant.service");
const submitRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
    // console.log(tenantId); 
    const payload = Object.assign(Object.assign({}, req.body), { tenant: tenantId });
    const result = yield tenant_service_1.TenantService.createTenantRequestIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Rental Request submitted successfully",
        data: result,
    });
}));
const getMyRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
    const result = yield tenant_service_1.TenantService.getTenantRequestsFromDB(tenantId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Retrieved your rental requests",
        data: result,
    });
}));
//done
const updateTenantProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const _b = req.body, { role } = _b, rest = __rest(_b, ["role"]); // Prevent role from being updated
    // console.log(tenantId, rest); 
    const result = yield tenant_service_1.TenantService.updateTenantProfileDB(tenantId, rest);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Tenant Profile Updated Successfully",
        data: result,
    });
}));
const getRentalRequestsForLandlord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
    // console.log('landlord', landlordId); 
    const result = yield tenant_service_1.TenantService.getAllRentalRequestsForLandlordFromDB(landlordId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Retrieved rental requests for landlord",
        data: result,
    });
}));
exports.TenantController = {
    submitRequest,
    getMyRequests,
    updateTenantProfile,
    getRentalRequestsForLandlord,
};
