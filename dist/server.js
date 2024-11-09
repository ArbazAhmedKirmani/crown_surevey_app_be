"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const protected_routes_1 = __importDefault(require("./routes/protected.routes"));
const unprotected_routes_1 = __importDefault(require("./routes/unprotected.routes"));
const error_handler_middleware_1 = __importDefault(require("./utils/middlewares/error-handler.middleware"));
const response_enhancer_middleware_1 = require("./utils/middlewares/response-enhancer.middleware");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.APP_PORT || 5000;
const corsOptions = {
    origin: "*",
    //http://localhost:5173", // Allow requests only from example.com
    // methods: "GET,POST",            // Allow GET and POST methods
    // allowedHeaders: "Content-Type,Authorization", // Allowed headers
    // credentials: true, // Allow credentials (cookies, authorization headers)
};
// Use middleware to parse JSON and URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use(response_enhancer_middleware_1.responseEnhancer);
// API Routes
app.use("/api", protected_routes_1.default);
app.use("/auth", unprotected_routes_1.default);
app.use(error_handler_middleware_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
