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
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const Analytics_service_1 = require("./Analytics.service");
const successResponse_1 = require("../../Re-useable/successResponse");
const adminAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Analytics_service_1.analyticsService.adminAnalyticsDB();
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Find admin analytics"));
    }
    catch (error) {
        next(error);
    }
});
const shopAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Analytics_service_1.analyticsService.shopAnalyticsDB(req === null || req === void 0 ? void 0 : req.user);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "shop analytics"));
    }
    catch (error) {
        next(error);
    }
});
const createNewsletter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Analytics_service_1.analyticsService.createNewsletterDB(req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "create newsletter"));
    }
    catch (error) {
        next(error);
    }
});
const findAllNewsLetterEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Analytics_service_1.analyticsService.findAllNewsLetterEmailDB();
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all newsletter"));
    }
    catch (error) {
        next(error);
    }
});
exports.analyticsController = {
    adminAnalytics,
    shopAnalytics,
    createNewsletter,
    findAllNewsLetterEmail,
};
