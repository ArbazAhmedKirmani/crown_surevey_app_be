"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryObject = void 0;
const app_config_1 = __importDefault(require("../config/app.config"));
const getQueryObject = (query) => ({
    take: Number(query === null || query === void 0 ? void 0 : query.take) || app_config_1.default.QUERY.TOP,
    skip: Number(query === null || query === void 0 ? void 0 : query.skip) || app_config_1.default.QUERY.SKIP,
    //   orderBy: query.orderBy || "desc",
});
exports.getQueryObject = getQueryObject;
