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
exports.paymentController = void 0;
const Payment_service_1 = require("./Payment.service");
const dotenv_1 = __importDefault(require("dotenv"));
const successResponse_1 = require("../../Re-useable/successResponse");
const Payment_const_1 = require("./Payment.const");
const pick_1 = __importDefault(require("../../shared/pick"));
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const payment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Payment_service_1.paymentService.paymentDB(req.user, req.body);
        res.send((0, successResponse_1.successResponse)(result, 200, "Payment ongoing ..."));
    }
    catch (error) {
        next(error);
    }
});
const callback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Payment_service_1.paymentService.callbackDB(req.body, req === null || req === void 0 ? void 0 : req.query);
        if (result === null || result === void 0 ? void 0 : result.success) {
            res.redirect(
            // `${process.env.FRONTEND_URL}payment-success?bookingId=${result?.bookingId}`
            //! todo should be dynamic transaction id
            `${process.env.FRONTEND_URL}/payment-success?bookingId=${result === null || result === void 0 ? void 0 : result.txnId}`);
        }
        if ((result === null || result === void 0 ? void 0 : result.success) === false) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
        }
    }
    catch (error) {
        next(error);
    }
});
const myAllPaymentInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Payment_const_1.paymentInfoFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Payment_service_1.paymentService.myAllPaymentInfoDB(req === null || req === void 0 ? void 0 : req.user, filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all user"));
    }
    catch (error) {
        next(error);
    }
});
const allPaymentInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Payment_const_1.paymentInfoFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Payment_service_1.paymentService.allPaymentInfoDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all payment"));
    }
    catch (error) {
        next(error);
    }
});
const shopAllPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Payment_const_1.paymentInfoFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Payment_service_1.paymentService.shopAllPaymentDB(req === null || req === void 0 ? void 0 : req.user, filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all shop payment"));
    }
    catch (error) {
        next(error);
    }
});
const adminAndVendorUpdatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Payment_service_1.paymentService.adminAndVendorUpdatePaymentDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.paymentId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "update payment"));
    }
    catch (error) {
        next(error);
    }
});
exports.paymentController = {
    payment,
    callback,
    myAllPaymentInfo,
    allPaymentInfo,
    adminAndVendorUpdatePayment,
    shopAllPayment,
};
