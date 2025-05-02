/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Response } from "express";


// export const handlerZodError = (err: any, res: Response) => {
//     const issues = err.issues.map((item: any) => {
//         return {
//             path: item.path.join('>'),
//             message: item.message
//         }
//     });

//     res.status(400).json({
//         success: false,
//         message: err.message,
//         issues: issues,
//         error: err
//     })

// }

import { ZodError } from "zod";
import { Response } from "express";

export const handlerZodError = (err: ZodError, res: Response) => {
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
