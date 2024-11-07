import { Request, Response, Router } from "express";
import FormService from "./forms.service";

const FormController = Router();
const formService = new FormService();

// FormController.get("/parent", async (req: Request, res: Response) => {
//   const data = await formService.findParentAll(req);
//   res.status(201).json({ data });
// });

// FormController.post("/parent", async (req: Request, res: Response) => {
//   const data = await formService.findById(req.body.formId);
//   res.status(201).json({ data });
// });

// FormController.get("/child", async (req: Request, res: Response) => {
//   const data = await formService.findParentAll(req);
//   res.status(201).json({ data });
// });

// FormController.post("/child", async (req: Request, res: Response) => {
//   const data = await formService.findById(req.body.formId);
//   res.status(201).json({ data });
// });

export default FormController;
