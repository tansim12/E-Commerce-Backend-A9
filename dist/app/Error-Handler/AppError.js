"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    // statusCode: number;
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
