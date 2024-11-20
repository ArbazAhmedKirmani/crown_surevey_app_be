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
    this.router.get("/", this.getJobs.bind(this));
    this.router.post("/", this.createJobs.bind(this));
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
      const result = await this.jobsService.getFieldsBySection(req.params.id!);
      res.sendSuccess(result);
    }
  );

  private getFieldById = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getFieldsById(req.params.id!);
    res.sendSuccess(result);
  });

  private getJobs = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.getJobs(req.params.id!);
    res.sendSuccess(result);
  });

  private createJobs = catchAsync(async (req: Request, res: IResponse) => {
    const result = await this.jobsService.createJob(req.body);
    res.sendSuccess(result);
  });
}

export default new JobsController().router;
