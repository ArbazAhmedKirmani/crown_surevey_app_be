import { Request, Router } from "express";
import prisma from "../prisma";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import SchemaService from "./schema.service";

const SchemaController = Router();
const schemaService = new SchemaService();

SchemaController.get(
  "/",
  catchAsync(async (req: Request, res: IResponse) => {
    const data = await schemaService.getAllSchema(req.query);
    res.sendSuccess(data, "success");
  })
);

SchemaController.post(
  "/",
  catchAsync(async (req: Request, res: IResponse) => {
    const data = await prisma.templateSchema.findMany({
      where: { deletedAt: null },
    });
    res.sendSuccess(data, "success");
  })
);

export default SchemaController;
