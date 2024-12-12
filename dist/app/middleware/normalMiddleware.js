"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const normalMiddleware = (app) => {
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://e-commerce-next-a9.vercel.app",
        ],
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(body_parser_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
};
exports.default = normalMiddleware;
