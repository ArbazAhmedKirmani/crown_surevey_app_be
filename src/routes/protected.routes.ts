import { Router } from "express";
import authenticateToken from "../utils/middlewares/jwt.middleware";
import SchemaController from "../modules/schema/schema.controller";
import FormController from "../modules/forms/forms.controller";

const ProtectedRoutes = Router();

ProtectedRoutes.use(authenticateToken);

// Controllers
ProtectedRoutes.use("/form", FormController);
ProtectedRoutes.use("/schema", SchemaController);

export default ProtectedRoutes;
