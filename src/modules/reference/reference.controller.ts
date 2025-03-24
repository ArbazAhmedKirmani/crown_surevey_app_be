import { Request, Router } from "express";
import ReferenceService from "./reference.service";
import { catchAsync } from "../../utils/middlewares/app-error.middleware";
import { IResponse } from "../../utils/middlewares/response-enhancer.middleware";
import { IQueryListing } from "../../utils/interfaces/helper.interface";
import {
  ICreateCategoryResponse,
  IResponseCreate,
} from "./reference.interface";

class ReferenceController {
  public router: Router;
  private referenceService: ReferenceService;

  constructor() {
    this.router = Router();
    this.referenceService = new ReferenceService();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get("/", this.getAllReferences.bind(this));
    this.router.get("/category", this.getAllReferenceCategory.bind(this));
    this.router.get(
      "/category/reference/:id",
      this.getAllReferenceCategory.bind(this)
    );
    this.router.get(
      "/category-reference/:id",
      this.getCategoryWithReference.bind(this)
    );
    this.router.get("/:id", this.getReferenceById.bind(this));
    this.router.get("/:id", this.getReferenceById.bind(this));
    this.router.get("/:id/category", this.getReferencesByCategory.bind(this));
    this.router.get("/category/:id", this.getReferenceByFormId.bind(this));
    this.router.post("/", this.createReferences.bind(this));
    this.router.post("/category", this.createReferencesCategory.bind(this));
    this.router.put("/:id", this.updateReferences.bind(this));
    this.router.delete("/:id", this.deleteReferences.bind(this));
    this.router.delete(
      "/category/:id",
      this.deleteReferenceCategory.bind(this)
    );
  }

  private getAllReferences = catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await this.referenceService.getAllReferences(req.query);
      res.sendSuccess(result);
    }
  );

  private getReferencesByCategory = catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await this.referenceService.getReferencesByCategory(
        req.query,
        req.params.id
      );
      res.sendSuccess(result);
    }
  );

  private createReferences = catchAsync(
    async (req: Request<IResponseCreate>, res: IResponse) => {
      const result = await this.referenceService.createResponse(req.body);
      res.sendSuccess(result);
    }
  );

  private getReferenceById = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.referenceService.getResponseById(req.params.id);
      res.sendSuccess(result);
    }
  );

  private updateReferences = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.referenceService.updateResponse(
        req.params.id,
        req.body
      );
      res.sendSuccess(result);
    }
  );

  private deleteReferences = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.referenceService.deleteResponse(req.params.id);
      res.sendSuccess(result);
    }
  );

  private deleteReferenceCategory = catchAsync(
    async (req: Request, res: IResponse) => {
      const result = await this.referenceService.deleteResponseCategory(
        req.params.id
      );
      res.sendSuccess(result);
    }
  );

  private getAllReferenceCategory = catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await this.referenceService.getCategories();
      res.sendSuccess(result);
    }
  );

  private getCategoryWithReference = catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await this.referenceService.getCategoriesWithReference(
        req.params.id!
      );
      res.sendSuccess(result);
    }
  );

  private getReferenceByFormId = catchAsync(
    async (req: Request<any, any, any, IQueryListing>, res: IResponse) => {
      const result = await this.referenceService.getCategoryByFormId(
        req.query,
        req.params.id
      );
      res.sendSuccess(result);
    }
  );

  private createReferencesCategory = catchAsync(
    async (req: Request<ICreateCategoryResponse>, res: IResponse) => {
      const result = await this.referenceService.createResponseCategory(
        req.body
      );
      res.sendSuccess(result);
    }
  );
}

export default new ReferenceController().router;
