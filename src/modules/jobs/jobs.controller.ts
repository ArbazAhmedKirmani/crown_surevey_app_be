import { Request, Router } from "express";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import JobsService from "./jobs.service";

class JobsController {
  public router: Router;
  private jobsService: JobsService;

  constructor() {
    this.router = Router();
    this.jobsService = new JobsService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/forms", this.getFormList.bind(this));
    this.router.get("/forms/:id", this.getSectionsByFormId.bind(this));
    this.router.get("/section/:id", this.getFieldsBySectionId.bind(this));
    this.router.get("/field/:id", this.getFieldById.bind(this));
    this.router.get("/detail/:id/job/:jobId", this.getJobsDetail.bind(this));
    this.router.post("/", this.createJobs.bind(this));
    this.router.post("/detail/:id", this.createJobDetail.bind(this));
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
        req?.query?.jobId as string
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

  private createJobs = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.createJob(req.body);
    res.sendSuccess(result);
  });

  private createJobDetail = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.createJobDetail(
      req.params.id,
      req.body
    );
    res.sendSuccess(result);
  });
}

export default new JobsController().router;
