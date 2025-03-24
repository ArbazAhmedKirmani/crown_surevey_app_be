import { Request, Response, Router } from "express";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import JobsService from "./jobs.service";
import { IGetJobs } from "./jobs.interface";
import { IQueryListing } from "../../utils/interfaces/helper.interface";

class JobsController {
  public router: Router;
  private jobsService: JobsService;

  constructor() {
    this.router = Router();
    this.jobsService = new JobsService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/:id/generate-pdf", this.generateJobPdf.bind(this));
    this.router.get("/forms", this.getFormList.bind(this));
    this.router.get("/section-fields/:id", this.getSectionFieldList.bind(this));
    this.router.get("/forms/:id", this.getSectionsByFormId.bind(this));
    this.router.get(
      "/section/:id/:jobId",
      this.getFieldsBySectionId.bind(this)
    );
    this.router.get("/field/:id", this.getFieldById.bind(this));
    this.router.get("/detail/:id/job/:jobId", this.getJobsDetail.bind(this));
    this.router.get("/:id", this.getJobById.bind(this));
    this.router.get("/", this.getJobs.bind(this));
    this.router.get("/:id/status", this.getJobStatus.bind(this));
    this.router.post("/", this.createJobs.bind(this));
    this.router.post("/detail/:id", this.createJobDetail.bind(this));
    this.router.put("/:id/status", this.updateJobStatus.bind(this));
    this.router.get("/fields/lookup", this.getFieldsLookup.bind(this));
    this.router.get("/fields/form/:id", this.getFieldsByForm.bind(this));
    this.router.get("/preview/:id", this.getJobPreview.bind(this));
  }

  private getFormList = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getFormList();
    res.sendSuccess(result);
  });

  private getSectionsByFormId = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.jobsService.getSectionsByForm(req.params.id!);
      res.sendSuccess(result);
    }
  );

  private getFieldsBySectionId = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.jobsService.getFieldsBySection(
        req.params.id!,
        req.params.jobId as string
      );
      res.sendSuccess(result);
    }
  );

  private getFieldById = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getFieldsById(req.params.id!);
    res.sendSuccess(result);
  });

  private getJobsDetail = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getJobsField(
      req.params.id!,
      req.params.jobId!
    );
    res.sendSuccess(result);
  });

  private getJobs = catchAsync(
    async (req: Request<unknown, any, any, IGetJobs>, res: IResponse) => {
      const result = await this.jobsService.getJob(req.query);
      res.sendPaginatedSuccess(
        result.data,
        result.count,
        +req.query.limit,
        +req.query.page,
        "Success"
      );
    }
  );

  private getJobById = catchAsync(
    async (
      req: Request<{ id: string }, any, any, IGetJobs>,
      res: IResponse
    ) => {
      const result = await this.jobsService.getJobById(req.params.id);
      res.sendSuccess(result, "Success");
    }
  );

  private createJobs = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.createJob(req.body);
    res.sendSuccess(result);
  });

  private createJobDetail = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.createJobDetail(
      req.params.id!,
      req.body
    );
    res.sendSuccess(result, "Job updated successfully");
  });

  private updateJobStatus = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.updateJobStatus(
      req.params.id!,
      req.body
    );
    res.sendSuccess(result, "Status successfully updated");
  });

  private getJobStatus = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getJobStatus(req.params.id!);
    res.sendSuccess(result, "Status successfully updated");
  });

  private generateJobPdf = catchAsync(
    async (req: Request<{ id: string }>, res: Response) => {
      const pdfBuffer = await this.jobsService.generatePdf(req.params.id);
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=updated-file.docx",
        // "Content-Type": "application/pdf",
        // "Content-Disposition": 'attachment; filename="document.pdf"',
      });

      res.end(pdfBuffer);
    }
  );

  private getFieldsLookup = catchAsync(
    async (req: Request<unknown, any, any, IQueryListing>, res: IResponse) => {
      const fields = await this.jobsService.getFieldsLookup(req.query);
      res.sendSuccess(fields);
    }
  );

  private getFieldsByForm = catchAsync(
    async (req: Request<{ id: string }>, res: IResponse) => {
      const result = await this.jobsService.getFieldsByForm(
        Number(req.params.id)
      );

      res.sendSuccess(result);
    }
  );

  private getSectionFieldList = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.jobsService.jobSectionFieldList(req.params.id);
      res.sendSuccess(result);
    }
  );

  private getJobPreview = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getJobPreview(req.params.id);
    res.sendSuccess(result);
  });
}

export default new JobsController().router;
