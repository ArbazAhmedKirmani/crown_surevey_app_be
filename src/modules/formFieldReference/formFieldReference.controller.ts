import { Request, Router } from "express";
import CustomerService from "../customer/customer.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import {
  ICreateFieldReference,
  IGetFieldReference,
} from "./formFieldReference.interface";
import FormFieldReferenceService from "./formFieldReference.service";

class FormFieldReferenceController {
  public router: Router;
  private formFieldReferenceService: FormFieldReferenceService;

  constructor() {
    this.router = Router();
    this.formFieldReferenceService = new FormFieldReferenceService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/:id", this.getFieldReferenceByForm.bind(this));
    this.router.post("/", this.createFieldResponse.bind(this));
  }

  private getFieldReferenceByForm = catchAsync(
    async (
      req: Request<{ id: number }, any, any, IGetFieldReference>,
      res: IResponse
    ) => {
      const result =
        await this.formFieldReferenceService.getFieldReferenceByForm(
          +req.params.id
        );

      res.sendSuccess(result);
    }
  );

  private createFieldResponse = catchAsync(
    async (
      req: Request<unknown, any, ICreateFieldReference, unknown>,
      res: IResponse
    ) => {
      const result = this.formFieldReferenceService.createFieldReference(
        req.body
      );

      res.sendSuccess(result);
    }
  );
}

export default new FormFieldReferenceController().router;
