import { NextFunction, Request, Response } from "express";
import AppError from "./app-error.middleware";

export default function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", err);
  let errorObject = {
    ok: false,
    status: "error",
    message: "Something went wrong. Please try again later.",
    timestamp: new Date().toISOString(),
    error: "An unexpected error occurred",
  };

  err["statusCode"] = err?.statusCode || 500;
  err["status"] = err?.status || "error";

  if (err?.isOperational) {
    res
      .status(err.statusCode)
      .json({ ...errorObject, status: err.status, message: err.message });
  } else {
    res.status(500).json(errorObject);
  }
}
