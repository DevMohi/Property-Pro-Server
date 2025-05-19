import Shurjopay, { VerificationResponse } from "shurjopay";

export const shurjopay = new Shurjopay();

shurjopay.config(
  "https://sandbox.shurjopayment.com",
  "sp_sandbox",
  "pyyk97hu&6u6",
  "INV",
  "https://property-pro-client.vercel.app/success"
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
