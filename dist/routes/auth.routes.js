"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = __importDefault(require("../utils/middlewares/jwt.middleware"));
const options_controller_1 = __importDefault(require("../modules/options/options.controller"));
const match_controller_1 = __importDefault(require("../modules/match/match.controller"));
const AuthRoutes = (0, express_1.Router)();
AuthRoutes.use(jwt_middleware_1.default);
// Controllers
AuthRoutes.use("options", options_controller_1.default);
AuthRoutes.use("match", match_controller_1.default);
exports.default = AuthRoutes;
