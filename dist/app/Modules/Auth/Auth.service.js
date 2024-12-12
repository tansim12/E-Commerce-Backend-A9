"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const config_1 = __importDefault(require("../../config"));
const http_status_codes_1 = require("http-status-codes");
const emailSender_1 = require("../../utils/emailSender");
const jwtHelpers_1 = require("../../helper/jwtHelpers");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const singUpDB = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPass = yield bcrypt.hash(body === null || body === void 0 ? void 0 : body.password, 12);
    const userData = {
        name: body === null || body === void 0 ? void 0 : body.name,
        email: body === null || body === void 0 ? void 0 : body.email,
        password: hashPass,
    };
    const result = yield prisma_1.default.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield tnx.user.create({
            data: userData,
        });
        yield tnx.userProfile.create({
            data: {
                email: userInfo.email,
                userId: userInfo.id,
            },
        });
        return userInfo;
    }));
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Something went wrong !");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: result.id,
        email: result === null || result === void 0 ? void 0 : result.email,
        role: result === null || result === void 0 ? void 0 : result.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ id: result.id, email: result === null || result === void 0 ? void 0 : result.email, role: result === null || result === void 0 ? void 0 : result.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.active,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ id: userData.id, email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.active,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, "5m");
    return {
        accessToken,
    };
});
const changePasswordDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            lastPasswordChange: new Date(),
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
const forgotPasswordDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.active,
        },
    });
    const resetPassToken = jwtHelpers_1.jwtHelpers.generateToken({ id: userData.id, email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    //console.log(resetPassToken)
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    // `${process.env.FRONTEND_URL}/forget-password?id=${user.id}&token=${resetToken} `
    yield (0, emailSender_1.emailSender)(userData.email, `
      <div>
          <p>Dear User,</p>
          <p>Your password reset link 
              <a href=${resetPassLink}>
                  <button>
                      Reset Password
                  </button>
              </a>
          </p>

      </div>
      `);
    //console.log(resetPassLink)
});
const resetPasswordDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.active,
        },
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcrypt.hash(payload.password, 12);
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
});
exports.AuthServices = {
    singUpDB,
    loginUser,
    refreshToken,
    forgotPasswordDB,
    changePasswordDB,
    resetPasswordDB,
};
