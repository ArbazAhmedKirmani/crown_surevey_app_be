import { Request, Response, Router } from "express";
import FormService from "./forms.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { IFormCreateDto } from "./form.interface";

const FormController = Router();
const formService = new FormService();

FormController.get(
  "/parent",
  catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await formService.findAllParentForm(req.query);
      res.sendPaginatedSuccess(
        result.data,
        result.count,
        +req.query.limit,
        +req.query.page,
        "Success"
      );
    }
  )
);

FormController.post(
  "/parent",
  catchAsync(async (req: Request<IFormCreateDto>, res: IResponse) => {
    const data = await formService.createParentForm(req.body);
    res.sendSuccess(data, "Successfully Created");
  })
);

// FormController.get("/child", async (req: Request, res: Response) => {
//   const data = await formService.findParentAll(req);
//   res.status(201).json({ data });
// });

// FormController.post("/child", async (req: Request, res: Response) => {
//   const data = await formService.findById(req.body.formId);
//   res.status(201).json({ data });
// });

export default FormController;
