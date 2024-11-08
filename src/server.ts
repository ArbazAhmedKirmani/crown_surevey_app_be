require("dotenv").config();

import { Application } from "express";
import ProtectedRoutes from "./routes/protected.routes";
import UnprotectedRoutes from "./routes/unprotected.routes";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import { responseEnhancer } from "./utils/middlewares/response-enhancer.middleware";
import express from "express";
import cors from "cors";

const app: Application = express();
const PORT = process.env.APP_PORT || 5000;

const corsOptions = {
  origin: "*",
  //http://localhost:5173", // Allow requests only from example.com
  // methods: "GET,POST",            // Allow GET and POST methods
  // allowedHeaders: "Content-Type,Authorization", // Allowed headers
  // credentials: true, // Allow credentials (cookies, authorization headers)
};

// Use middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(responseEnhancer);

// API Routes
app.use("/api", ProtectedRoutes);
app.use("/auth", UnprotectedRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
