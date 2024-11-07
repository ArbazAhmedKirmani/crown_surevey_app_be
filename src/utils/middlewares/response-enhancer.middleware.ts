import { Request, Response, NextFunction, RequestHandler } from "express";

export interface IResponse<T = any> extends Response {
  sendSuccess: (data: T, message?: string) => void;
  sendError: (
    message: string,
    statusCode?: number,
    errorDetails?: string
  ) => void;
}

export const responseEnhancer: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customRes = res as IResponse;

  customRes.sendSuccess = function <T>(
    data: T,
    message = "Request was successful"
  ) {
    this.status(200).json({
      ok: true,
      status: "success",
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  };

  customRes.sendError = function (
    message,
    statusCode = 500,
    errorDetails = "An unexpected error occurred"
  ) {
    this.status(statusCode).json({
      ok: false,
      status: "error",
      message,
      error: errorDetails,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};
