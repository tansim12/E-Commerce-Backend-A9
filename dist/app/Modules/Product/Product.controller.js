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
exports.productController = void 0;
const Product_service_1 = require("./Product.service");
const successResponse_1 = require("../../Re-useable/successResponse");
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../shared/pick"));
const Shop_const_1 = require("../Shop/Shop.const");
const Product_const_1 = require("./Product.const");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product_service_1.productService.createProductDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Product Created"));
    }
    catch (error) {
        next(error);
    }
});
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Product_service_1.productService.updateProductDB(req === null || req === void 0 ? void 0 : req.user, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.productId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Product updated"));
    }
    catch (error) {
        next(error);
    }
});
const findVendorShopAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Product_service_1.productService.findVendorShopAllProductsDB(req === null || req === void 0 ? void 0 : req.user, filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all product"));
    }
    catch (error) {
        next(error);
    }
});
const adminFindAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Product_service_1.productService.adminFindAllProductsDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find Products"));
    }
    catch (error) {
        next(error);
    }
});
const publicTopSaleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Product_service_1.productService.publicTopSaleProductDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find top sale Products"));
    }
    catch (error) {
        next(error);
    }
});
const publicSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Product_service_1.productService.publicSingleProductDb((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.productId);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Single Product Find "));
    }
    catch (error) {
        next(error);
    }
});
const publicFlashSaleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Product_service_1.productService.publicFlashSaleProductDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find flash sale Products"));
    }
    catch (error) {
        next(error);
    }
});
const publicPromoCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product_service_1.productService.publicPromoCheckDB(req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Promo Check "));
    }
    catch (error) {
        next(error);
    }
});
const publicAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Product_const_1.shopAllProductsFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Product_service_1.productService.publicAllProductsDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all product"));
    }
    catch (error) {
        next(error);
    }
});
const publicCompareProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product_service_1.productService.publicCompareProductDB(req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find compare product"));
    }
    catch (error) {
        next(error);
    }
});
const findRelevantProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, []);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    try {
        const result = yield Product_service_1.productService.findRelevantProductDB((req === null || req === void 0 ? void 0 : req.body) || [], filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find relevant product"));
    }
    catch (error) {
        next(error);
    }
});
const productReviewByPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Product_service_1.productService.productReviewByPaymentDB(req === null || req === void 0 ? void 0 : req.user, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.paymentId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Product review by payment create done"));
    }
    catch (error) {
        next(error);
    }
});
const vendorOrShopRepliedReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product_service_1.productService.vendorOrShopRepliedReviewsDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Product review by payment create done"));
    }
    catch (error) {
        next(error);
    }
});
exports.productController = {
    createProduct,
    updateProduct,
    findVendorShopAllProducts,
    adminFindAllProducts,
    publicTopSaleProduct,
    publicSingleProduct,
    publicFlashSaleProduct,
    publicPromoCheck,
    publicAllProducts,
    publicCompareProduct,
    findRelevantProduct,
    productReviewByPayment,
    vendorOrShopRepliedReviews,
};
