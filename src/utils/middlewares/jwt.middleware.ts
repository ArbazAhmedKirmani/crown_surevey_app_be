import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppConfig from "../config/app.config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Access denied." });

  const result = jwt.verify(token, AppConfig.JWT.SECRET_KEY!);

  if (!result) return res.status(403).json({ error: "Invalid token." });

  req["user"] = result;

  next();
};

export default authenticateToken;
