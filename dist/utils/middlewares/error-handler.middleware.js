"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    console.error("Error:", err);
    let errorObject = {
        ok: false,
        status: "error",
        message: "Something went wrong. Please try again later.",
        timestamp: new Date().toISOString(),
        error: "An unexpected error occurred",
    };
    err["statusCode"] = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    err["status"] = (err === null || err === void 0 ? void 0 : err.status) || "error";
    if (err === null || err === void 0 ? void 0 : err.isOperational) {
        res
            .status(err.statusCode)
            .json(Object.assign(Object.assign({}, errorObject), { status: err.status, message: err.message }));
    }
    else {
        res.status(500).json(errorObject);
    }
}
exports.default = errorHandler;
