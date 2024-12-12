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
exports.AuthController = void 0;
const Auth_service_1 = require("./Auth.service");
const successResponse_1 = require("../../Re-useable/successResponse");
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Auth_service_1.AuthServices.singUpDB(req.body);
        const { refreshToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: config_1.default.env === "production",
            httpOnly: true,
        });
        res.send((0, successResponse_1.successResponse)({
            accessToken: result.accessToken,
            refreshToken,
        }, http_status_codes_1.StatusCodes.OK, "Signup successfully!"));
    }
    catch (error) {
        next(error);
    }
});
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Auth_service_1.AuthServices.loginUser(req.body);
        const { refreshToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: config_1.default.env === "production",
            httpOnly: true,
        });
        res.send((0, successResponse_1.successResponse)({
            accessToken: result.accessToken,
            refreshToken,
        }, http_status_codes_1.StatusCodes.OK, "Logged in successfully!"));
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const result = yield Auth_service_1.AuthServices.refreshToken(refreshToken);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "refresh token send"));
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Auth_service_1.AuthServices.changePasswordDB(req.user, req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Password Change Successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Auth_service_1.AuthServices.forgotPasswordDB(req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Email link sending done "));
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization || "";
        const result = yield Auth_service_1.AuthServices.resetPasswordDB(token, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Password Change Successfully done"));
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    signUp,
    loginUser,
    refreshToken,
    forgotPassword,
    changePassword,
    resetPassword,
};
