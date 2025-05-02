"use strict";
// Shurjopay.config(
//   process.env.sp_endpoint,
//   process.env.sp_username,
//   process.env.sp_password,
//   process.env.sp_prefix,
//   process.env.sp_return_url
// );
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
exports.OrderUtils = exports.shurjopay = void 0;
const shurjopay_1 = __importDefault(require("shurjopay"));
exports.shurjopay = new shurjopay_1.default();
exports.shurjopay.config("https://sandbox.shurjopayment.com", "sp_sandbox", "pyyk97hu&6u6", "INV", "https://basa-vara-client.vercel.app/tenant/payments");
const makePaymentAsync = (orderPayload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        exports.shurjopay.makePayment(orderPayload, (res) => resolve(res), (err) => reject(err));
    });
});
// Payment Verify
const verifyPaymentAsync = (order_id) => {
    return new Promise((resolve, reject) => {
        exports.shurjopay.verifyPayment(order_id, (res) => resolve(res), (err) => reject(err));
    });
};
exports.OrderUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
