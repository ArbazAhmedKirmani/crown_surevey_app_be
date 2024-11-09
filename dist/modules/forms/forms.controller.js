"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forms_service_1 = __importDefault(require("./forms.service"));
const FormController = (0, express_1.Router)();
const formService = new forms_service_1.default();
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
exports.default = FormController;
