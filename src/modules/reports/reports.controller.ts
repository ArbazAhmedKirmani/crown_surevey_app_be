import { Request, Router } from "express";
import ReportService from "./reports.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";

class ReportController {
  public router: Router;
  private reportService: ReportService;

  constructor() {
    this.router = Router();
    this.reportService = new ReportService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/all/job/pending", this.getAllPendingJob.bind(this));
    this.router.get(
      "/monthly/job/completed",
      this.getCompletedJobMonthly.bind(this)
    );
  }

  private getAllPendingJob = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.reportService.getAllPendingJob();
      res.sendSuccess({ count: result });
    }
  );

  private getCompletedJobMonthly = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.reportService.getCompletedJobMonthly();
      res.sendSuccess({ count: result });
    }
  );
}

export default new ReportController().router;
