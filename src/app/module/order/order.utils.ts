// Shurjopay.config(
//   process.env.sp_endpoint,
//   process.env.sp_username,
//   process.env.sp_password,
//   process.env.sp_prefix,
//   process.env.sp_return_url
// );

import Shurjopay, { VerificationResponse } from "shurjopay";

export const shurjopay = new Shurjopay();

shurjopay.config(
  "https://sandbox.shurjopayment.com",
  "sp_sandbox",
  "pyyk97hu&6u6",
  "INV",
  "https://basa-vara-client.vercel.app/tenant/payments"
);

const makePaymentAsync = async (
  orderPayload: any
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      orderPayload,
      (res: any) => resolve(res),
      (err: any) => reject(err)
    );
  });
};

// Payment Verify
const verifyPaymentAsync = (
  order_id: string
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (res) => resolve(res),
      (err) => reject(err)
    );
  });
};

export const OrderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
