"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = __importDefault(require("../utils/middlewares/jwt.middleware"));
const schema_controller_1 = __importDefault(require("../modules/schema/schema.controller"));
const forms_controller_1 = __importDefault(require("../modules/forms/forms.controller"));
const ProtectedRoutes = (0, express_1.Router)();
ProtectedRoutes.use(jwt_middleware_1.default);
// Controllers
ProtectedRoutes.use("/form", forms_controller_1.default);
ProtectedRoutes.use("/schema", schema_controller_1.default);
exports.default = ProtectedRoutes;
