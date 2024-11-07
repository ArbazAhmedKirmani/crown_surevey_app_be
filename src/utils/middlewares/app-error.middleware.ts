import { NextFunction, Request, Response } from "express";

export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
