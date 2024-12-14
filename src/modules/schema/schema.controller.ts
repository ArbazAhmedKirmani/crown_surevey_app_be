import { Request, Router } from "express";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";

const SchemaController = Router();

SchemaController.get(
  "/",
  catchAsync(
    catchAsync(
      async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
        // const data = await schemaService.getAllSchema(req.query);
        // res.sendPaginatedSuccess(
        //   data.result,
        //   data.count,
        //   +req.query?.limit,
        //   +req.query?.page,
        //   "success"
        // );
        res.sendSuccess([]);
      }
    )
  )
);

SchemaController.post(
  "/",
  catchAsync(async (req: Request, res: IResponse) => {
    // const data = await prisma.templateSchema.findMany({
    //   where: { deletedAt: null },
    // });
    // res.sendSuccess(data, "success");
  })
);

export default SchemaController;
