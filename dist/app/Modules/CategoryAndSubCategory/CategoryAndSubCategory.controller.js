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
exports.categoryAndSubCategoryController = void 0;
const CategoryAndSubCategory_service_1 = require("./CategoryAndSubCategory.service");
const successResponse_1 = require("../../Re-useable/successResponse");
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../shared/pick"));
const CategoryAndSubCategory_const_1 = require("./CategoryAndSubCategory.const");
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.createCategoryDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Category Create successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.updateCategoryDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.categoryId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Category update successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const createSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.createSubCategoryDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Sub Category Create successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const updateSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.updateSubCategoryDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.subCategoryId, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Sub Category update successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const findAllCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, CategoryAndSubCategory_const_1.categoryFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.findAllCategoryDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "All Category"));
    }
    catch (error) {
        next(error);
    }
});
const findAllSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, CategoryAndSubCategory_const_1.categoryFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.findAllSubCategoryDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "All Sub Category"));
    }
    catch (error) {
        next(error);
    }
});
const existFindAllCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.existFindAllCategoryDB();
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "All Category just name and id send"));
    }
    catch (error) {
        next(error);
    }
});
const singleCategoryBaseFindAllSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.singleCategoryBaseFindAllSubCategoryDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.categoryId);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Category base find all sub category just name and id send"));
    }
    catch (error) {
        next(error);
    }
});
const publicFindAllCategoryWithSubCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryAndSubCategory_service_1.categoryAndSubCategoryService.publicFindAllCategoryWithSubCategoryDB();
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Sll Category and sub category find "));
    }
    catch (error) {
        next(error);
    }
});
exports.categoryAndSubCategoryController = {
    createCategory,
    createSubCategory,
    updateCategory,
    updateSubCategory,
    findAllCategory,
    findAllSubCategory,
    existFindAllCategory,
    singleCategoryBaseFindAllSubCategory,
    publicFindAllCategoryWithSubCategory,
};
