"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof library_1.PrismaClientValidationError) {
        // Use imported PrismaClientValidationError here
        message = "Validation Error";
        error = err.message;
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate Key error";
            error = err.meta;
        }
    }
    res.status((error === null || error === void 0 ? void 0 : error.name) === "NotFoundError" ? 404 : statusCode).json({
        success,
        message,
        status: (error === null || error === void 0 ? void 0 : error.name) === "NotFoundError" ? 404 : (error === null || error === void 0 ? void 0 : error.statusCode) || statusCode,
        error,
    });
};
exports.default = globalErrorHandler;
