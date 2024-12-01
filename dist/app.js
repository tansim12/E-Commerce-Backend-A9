"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/Error-Handler/globalErrorHandler"));
const normalMiddleware_1 = __importDefault(require("./app/middleware/normalMiddleware"));
const app = (0, express_1.default)();
(0, normalMiddleware_1.default)(app);
app.get("/", (req, res) => {
    res.send({
        Message: "A-9-Postgres-Prisma  server..",
    });
});
app.all("*", (req, res, next) => {
    const error = new Error(`Can't find ${req.url} on the server`);
    next(error);
});
// global error handle
app.use(globalErrorHandler_1.default);
exports.default = app;
