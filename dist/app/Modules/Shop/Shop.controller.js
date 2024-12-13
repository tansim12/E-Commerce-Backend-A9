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
exports.shopController = void 0;
const successResponse_1 = require("../../Re-useable/successResponse");
const http_status_codes_1 = require("http-status-codes");
const Shop_service_1 = require("./Shop.service");
const pick_1 = __importDefault(require("../../shared/pick"));
const Shop_const_1 = require("./Shop.const");
const createShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Shop_service_1.shopService.crateShopDB(req === null || req === void 0 ? void 0 : req.user, req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Shop create successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const findSingleShopPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = (0, pick_1.default)(req.query, []);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Shop_service_1.shopService.findSingleShopPublicDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.shopId, filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Single Shop find successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const findAllShopPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Shop_service_1.shopService.findAllShopPublicDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Find all Shop"));
    }
    catch (error) {
        next(error);
    }
});
const shopFollowing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Shop_service_1.shopService.shopFollowingDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Shop Following successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const shopReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Shop_service_1.shopService.shopReviewDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Shop review successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const vendorFindHisShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Shop_service_1.shopService.vendorFindHisShopDB(req === null || req === void 0 ? void 0 : req.user);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Vendor Find his shop"));
    }
    catch (error) {
        next(error);
    }
});
const updateShopInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Shop_service_1.shopService.updateShopInfoDB(req === null || req === void 0 ? void 0 : req.user, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.shopId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Shop info update"));
    }
    catch (error) {
        next(error);
    }
});
const adminFindAllShop = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, Shop_const_1.shopFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield Shop_service_1.shopService.adminFindAllShopDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Find all Shop"));
    }
    catch (error) {
        next(error);
    }
});
const findSingleUserFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Shop_service_1.shopService.findSingleUserFollowDB(req === null || req === void 0 ? void 0 : req.user, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.shopId);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Find user follow"));
    }
    catch (error) {
        next(error);
    }
});
exports.shopController = {
    createShop,
    findAllShopPublic,
    findSingleShopPublic,
    shopFollowing,
    shopReview,
    vendorFindHisShop,
    updateShopInfo,
    adminFindAllShop,
    findSingleUserFollow,
};
