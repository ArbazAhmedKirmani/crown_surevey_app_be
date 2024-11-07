import {
  comparePassword,
  hashPassword,
} from "../../utils/helpers/global.helper";
import AppError from "../../utils/middlewares/app-error.middleware";
import prisma from "../prisma";
import { ILoginDto, ISignupDto } from "./auth.interface";

export default class AuthService {
  async login(body: ILoginDto) {
    const result = await prisma.users.findUnique({
      where: { email: body.email, deletedAt: null },
      select: { email: true, password: true, name: true },
    });
    if (!result) {
      throw new AppError("Email not found", 404);
    }

    if (!(await comparePassword(body.password, result.password))) {
      throw new AppError("Password is Incorrect", 400);
    }
    return result;
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
