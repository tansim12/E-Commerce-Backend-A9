import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof PrismaClientValidationError) {
    // Use imported PrismaClientValidationError here
    message = "Validation Error";
    error = err.message;
  } else if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key error";
      error = err.meta;
    }
  }

  res.status(error?.name === "NotFoundError" ? 404 : statusCode).json({
    success,
    message,
    status:
      error?.name === "NotFoundError" ? 404 : error?.statusCode || statusCode,
    error,
  });
};

export default globalErrorHandler;
