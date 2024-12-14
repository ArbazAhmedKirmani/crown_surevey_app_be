import { Request, Router } from "express";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IGetCustomer } from "./customer.interface";
import CustomerService from "./customer.service";

class CustomerController {
  public router: Router;
  private customerService: CustomerService;

  constructor() {
    this.router = Router();
    this.customerService = new CustomerService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/", this.getCustomers.bind(this));
  }

  private getCustomers = catchAsync(
    async (req: Request<unknown, any, any, IGetCustomer>, res: IResponse) => {
      const result = await this.customerService.getCustomers(req.query);

      res.sendPaginatedSuccess(
        result.data,
        result.count,
        +req?.query?.limit,
        +req?.query?.page,
        "Success"
      );
    }
  );
}

export default new CustomerController().router;
