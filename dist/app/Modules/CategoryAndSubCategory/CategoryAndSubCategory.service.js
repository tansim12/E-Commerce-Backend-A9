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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAndSubCategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const formatCategoryName_1 = require("../../utils/formatCategoryName");
const CategoryAndSubCategory_const_1 = require("./CategoryAndSubCategory.const");
const paginationHelper_1 = require("../../helper/paginationHelper");
const createCategoryDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = payload, newPayload = __rest(payload, ["categoryName"]);
    const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
    const isExistCategory = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category already exist");
    }
    const isExistSubCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistSubCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This SubCategory already exist");
    }
    const result = yield prisma_1.default.category.create({
        data: Object.assign(Object.assign({}, newPayload), { categoryName: categoryNameFormate, adminId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id }),
    });
    return result;
});
const updateCategoryDB = (categoryId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = payload, newPayload = __rest(payload, ["categoryName"]);
    const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
    const isExistCategory = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: categoryNameFormate,
            NOT: {
                id: categoryId,
            },
        },
    });
    if (isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category already exist");
    }
    const isExistSubCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistSubCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This SubCategory already exist");
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id: categoryId,
        },
        data: Object.assign(Object.assign({}, newPayload), { categoryName: categoryNameFormate }),
    });
    return result;
});
const createSubCategoryDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = payload;
    const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
    const isExistCategory = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category already exist");
    }
    const isExistSubCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistSubCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This SubCategory already exist");
    }
    const isDeleteCategory = yield prisma_1.default.category.findUnique({
        where: {
            id: payload.categoryId,
            isDelete: true,
        },
    });
    if (isDeleteCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category already Delete");
    }
    const result = yield prisma_1.default.subCategory.create({
        data: {
            categoryId: payload.categoryId,
            categoryName: categoryNameFormate,
            adminId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
        },
    });
    return result;
});
const updateSubCategoryDB = (subCategoryId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = payload, others = __rest(payload, ["categoryName"]);
    const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
    const isExistCategory = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: categoryNameFormate,
        },
    });
    if (isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This Category already exist");
    }
    const isExistSubCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            categoryName: categoryNameFormate,
            NOT: {
                id: subCategoryId,
            },
        },
    });
    if (isExistSubCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "This SubCategory already exist");
    }
    const result = yield prisma_1.default.subCategory.update({
        where: {
            id: subCategoryId,
        },
        data: Object.assign({ categoryName: categoryNameFormate }, others),
    });
    return result;
});
const findAllCategoryDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: CategoryAndSubCategory_const_1.categorySearchAbleFields.map((field) => ({
                [field]: {
                    contains: queryObj.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = { AND: andCondition };
    const result = yield prisma_1.default.category.findMany({
        where: whereConditions,
        include: {
            admin: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    status: true,
                    isDelete: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.category.count({
        where: whereConditions,
    });
    const meta = {
        page,
        limit,
        total,
    };
    return {
        meta,
        result,
    };
});
const findAllSubCategoryDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: CategoryAndSubCategory_const_1.categorySearchAbleFields.map((field) => ({
                [field]: {
                    contains: queryObj.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = { AND: andCondition };
    const result = yield prisma_1.default.subCategory.findMany({
        where: whereConditions,
        include: {
            category: true,
            admin: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    status: true,
                    isDelete: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.subCategory.count({
        where: whereConditions,
    });
    const meta = {
        page,
        limit,
        total,
    };
    return {
        meta,
        result,
    };
});
const existFindAllCategoryDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: {
            isDelete: false,
        },
        select: {
            id: true,
            categoryName: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const singleCategoryBaseFindAllSubCategoryDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id: categoryId,
            isDelete: false,
        },
    });
    const result = yield prisma_1.default.subCategory.findMany({
        where: {
            isDelete: false,
            category: {
                id: categoryId,
            },
        },
        select: {
            id: true,
            categoryName: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const publicFindAllCategoryWithSubCategoryDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        select: {
            categoryName: true,
            id: true,
            subCategory: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
        },
        take: 10,
        orderBy: {
            categoryName: "asc"
        }
    });
    return result;
});
exports.categoryAndSubCategoryService = {
    createCategoryDB,
    createSubCategoryDB,
    updateCategoryDB,
    updateSubCategoryDB,
    findAllCategoryDB,
    findAllSubCategoryDB,
    existFindAllCategoryDB,
    singleCategoryBaseFindAllSubCategoryDB,
    publicFindAllCategoryWithSubCategoryDB,
};
