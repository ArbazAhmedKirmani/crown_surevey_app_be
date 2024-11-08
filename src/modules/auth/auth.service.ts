import AppConfig from "../../utils/config/app.config";
import {
  comparePassword,
  hashPassword,
} from "../../utils/helpers/global.helper";
import AppError from "../../utils/middlewares/app-error.middleware";
import prisma from "../prisma";
import { ILoginDto, ISignupDto } from "./auth.interface";
import jwt from "jsonwebtoken";

export default class AuthService {
  async login(body: ILoginDto) {
    const result: any = await prisma.users.findUnique({
      where: { email: body.email, deletedAt: null },
      select: { email: true, password: true, name: true },
    });
    if (!result) {
      throw new AppError("Email not found", 404);
    }

    if (!(await comparePassword(body.password, result.password))) {
      throw new AppError("Password is Incorrect", 400);
    }

    delete result.password;

    const token = jwt.sign(result, AppConfig.JWT.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: AppConfig.JWT.TOKEN_EXPIRY,
    });
    return { ...result, token };
  }

  async signup(body: ISignupDto) {
    const userEmail = await prisma.users.findFirst({
      where: { email: body.email, deletedAt: null },
    });

    if (userEmail) {
      throw new AppError("Email already exists", 403);
    }

    const hashedPassword: string = await hashPassword(body.password);

    const result = prisma.users.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    return result;
  }
}
