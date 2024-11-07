"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const AppConfig = {
    APP: { PORT: Number(process.env.PORT) },
    JWT: { SECRET_KEY: process.env.JWT_SECRET_KEY },
    QUERY: { TOP: 10, SKIP: 0, ORDER_BY: "desc" },
};
exports.default = AppConfig;
