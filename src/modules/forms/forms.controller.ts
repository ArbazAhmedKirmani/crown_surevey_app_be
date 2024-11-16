import { Request, Response, Router } from "express";
import FormService from "./forms.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import { IFormCreateDto, IFormUpdateDto } from "./form.interface";

const FormController = Router();
const formService = new FormService();

FormController.get(
  "/",
  catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await formService.findAllForm(req.query);
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

FormController.get(
  "/:id/",
  catchAsync(async (req: Request, res: IResponse) => {
    const result = await formService.findFormById(+req.params.id);
    res.sendSuccess(result, "Success");
  })
);

FormController.post(
  "/",
  catchAsync(async (req: Request<IFormCreateDto>, res: IResponse) => {
    const data = await formService.createForm(req.body);
    res.sendSuccess(data, "Successfully Created");
  })
);

FormController.patch(
  "/:id",
  catchAsync(
    async (req: Request<{ id: string }, IFormUpdateDto>, res: IResponse) => {
      const data = await formService.updateForm(+req.params.id, req.body);
      res.sendSuccess(data, "Successfully Updated");
    }
  )
);

FormController.get(
  "/pdf/:type",
  async (req: Request<{ type: "blank" | "download" }>, res: Response) => {
    const type = req.params.type;
    if (type === "blank") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="rhs_level_two.pdf"'
      );
      res.send();
    }
    if (type === "download") {
      res.send();
    }
  }
);

FormController.delete(
  "/",
  catchAsync(async (req: Request, res: IResponse) => {
    const data = await formService.deleteForm(req.body.id);
    res.sendSuccess(data, "Successfully deleted");
  })
);

export default FormController;
