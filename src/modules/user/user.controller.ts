import { Request, Router } from "express";
import UserService from "./user.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";

class UserController {
  public router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router();
    this.userService = new UserService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/", this.getUsers.bind(this));
  }

  private getUsers = catchAsync(
    async (
      req: Request<any, unknown, unknown, IQueryListing>,
      res: IResponse
    ) => {
      const result = await this.userService.getUsers(req.query);
      res.sendSuccess(result, "Status successfully updated");
    }
  );
}

export default new UserController().router;
