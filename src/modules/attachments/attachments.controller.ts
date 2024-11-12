import { Request, Router } from "express";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import AttachmentsService from "./attachments.service";
import { UploadedFile } from "express-fileupload";

const AttachmentController = Router();
const AttachmentService = new AttachmentsService();

AttachmentController.get(
  "/:id/",
  catchAsync(async (req: Request, res: IResponse) => {
    await AttachmentService.getAttachment(req.params.id, res);
  })
);

AttachmentController.post(
  "/",
  catchAsync(async (req: Request, res: IResponse) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    await AttachmentService.uploadFile(req.files.file as UploadedFile, res);
  })
);

AttachmentController.put(
  "/:id",
  catchAsync(async (req: Request, res: IResponse) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    await AttachmentService.updateAttachment(
      req.params.id,
      req.files.file as UploadedFile,
      res
    );
  })
);

AttachmentController.delete(
  "/:id",
  catchAsync(async (req: Request, res: IResponse) => {
    const result = await AttachmentService.deleteAttachment(req.params.id);
    res.sendSuccess(result, "Attachment successfully deleted");
  })
);

export default AttachmentController;
