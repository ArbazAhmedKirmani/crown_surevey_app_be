import { Router } from "express";
import AuthController from "../modules/auth/auth.controller";

const UnprotectedRoutes = Router();

// Controllers
UnprotectedRoutes.use(AuthController);

export default UnprotectedRoutes;
