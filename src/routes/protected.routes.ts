import { Router } from "express";
import authenticateToken from "../utils/middlewares/jwt.middleware";
import SchemaController from "../modules/schema/schema.controller";
import FormController from "../modules/forms/forms.controller";
import AttachmentController from "../modules/attachments/attachments.controller";
import JobsController from "../modules/jobs/jobs.controller";
import ReferenceController from "../modules/reference/reference.controller";
import CustomerController from "../modules/customer/customer.controller";
import userController from "../modules/user/user.controller";
import ReportsController from "../modules/reports/reports.controller";

const ProtectedRoutes = Router();

ProtectedRoutes.use(authenticateToken);

// Controllers
ProtectedRoutes.use("/reference", ReferenceController);
ProtectedRoutes.use("/jobs", JobsController);
ProtectedRoutes.use("/form", FormController);
ProtectedRoutes.use("/schema", SchemaController);
ProtectedRoutes.use("/upload", AttachmentController);
ProtectedRoutes.use("/customer", CustomerController);
ProtectedRoutes.use("/user", userController);
ProtectedRoutes.use("/report", ReportsController);

export default ProtectedRoutes;
