import { Response } from "express";

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TSuccessResponse<T> = {
  status?: boolean;
  success: boolean;
  statusCode: number;
  message: string;
  token?: string;
  data: T | T[] | null;
  meta?: TMeta;
};

const sendResponse = <T>(res: Response, data: TSuccessResponse<T>) => {
  res.status(data.statusCode).json({
    status: true,
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
