require("dotenv").config();

import { Application } from "express";
import ProtectedRoutes from "./routes/protected.routes";
import UnprotectedRoutes from "./routes/unprotected.routes";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import { responseEnhancer } from "./utils/middlewares/response-enhancer.middleware";
const express = require("express");

const app: Application = express();
const PORT = process.env.APP_PORT || 5000;

// Use middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseEnhancer);

// API Routes
app.use("/api", ProtectedRoutes);
app.use("/auth", UnprotectedRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
