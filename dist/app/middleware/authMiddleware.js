"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../shared/prisma"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Error-Handler/AppError"));
dotenv_1.default.config();
const handleUnauthorizedError = (message, next) => {
    const error = new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, message);
    next(error);
};
const authMiddleWare = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return handleUnauthorizedError("You have no access to this route", next);
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.jwt_secret);
            const { role, email } = decoded;
            const user = yield prisma_1.default.user.findUniqueOrThrow({
                where: {
                    email,
                    isDelete: false,
                    status: client_1.UserStatus.active,
                },
            });
            if (user === null || user === void 0 ? void 0 : user.isDelete) {
                return next(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This User Already Deleted !"));
            }
            if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
                return handleUnauthorizedError("You have no access to this route", next);
            }
            const data = {
                id: user === null || user === void 0 ? void 0 : user.id,
                role: user === null || user === void 0 ? void 0 : user.role,
                email: user === null || user === void 0 ? void 0 : user.email,
            };
            req.user = data;
            next();
        }
        catch (error) {
            return handleUnauthorizedError("You have no access to this route", next);
        }
    });
};
exports.authMiddleWare = authMiddleWare;
