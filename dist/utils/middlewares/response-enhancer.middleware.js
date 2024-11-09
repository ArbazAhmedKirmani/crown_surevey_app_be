"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseEnhancer = void 0;
const responseEnhancer = (req, res, next) => {
    const customRes = res;
    customRes.sendSuccess = function (data, message = "Request was successful") {
        this.status(200).json({
            ok: true,
            status: "success",
            data,
            message,
            timestamp: new Date().toISOString(),
        });
    };
    customRes.sendPaginatedSuccess = function (data, totalCount, itemsPerPage, pageNumber, message = "Request was successful") {
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
        const prevPage = pageNumber > 1 ? pageNumber - 1 : null;
        this.status(200).json({
            ok: true,
            status: "success",
            data,
            totalCount,
            nextPage,
            prevPage,
            message,
            timestamp: new Date().toISOString(),
        });
    };
    customRes.sendError = function (message, statusCode = 500, errorDetails = "An unexpected error occurred") {
        this.status(statusCode).json({
            ok: false,
            status: "error",
            message,
            error: errorDetails,
            timestamp: new Date().toISOString(),
        });
    };
    next();
};
exports.responseEnhancer = responseEnhancer;
