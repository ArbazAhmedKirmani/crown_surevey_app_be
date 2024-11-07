import { NextFunction, Request, Router } from "express";
import AuthService from "./auth.service";
import { ILoginDto, ISignupDto } from "./auth.interface";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";

const AuthController = Router();
const authService = new AuthService();

AuthController.post(
  "/login",
  catchAsync(
    async (req: Request<ILoginDto>, res: IResponse, next: NextFunction) => {
      const data = await authService.login(req.body);

      return res.sendSuccess(data);
    }
  )
);

AuthController.post(
  "/signup",
  catchAsync(
    async (req: Request<ISignupDto>, res: IResponse, next: NextFunction) => {
      const data = await authService.signup(req.body);
      return res.sendSuccess(data, "Signup Successfully");
    }
  )
);

export default AuthController;
