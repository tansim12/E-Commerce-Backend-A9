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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const paginationHelper_1 = require("../../helper/paginationHelper");
const User_const_1 = require("./User.const");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const getAllUsersDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: User_const_1.userSearchAbleFields.map((field) => ({
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
    const result = yield prisma.user.findMany({
        where: whereConditions,
        select: {
            email: true,
            name: true,
            createdAt: true,
            id: true,
            status: true,
            isDelete: true,
            role: true,
            updatedAt: true,
            userProfile: true,
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
    const total = yield prisma.user.count({
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
const adminUpdateUserDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if ((payload === null || payload === void 0 ? void 0 : payload.email) || payload.password) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "You Can't change email or password");
    }
    const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield tx.user.update({
            where: {
                id: userId,
            },
            data: payload,
            select: {
                id: true,
                name: true,
                email: true,
                isDelete: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });
        yield tx.userProfile.update({
            where: {
                email: userInfo.email,
            },
            data: {
                status: payload === null || payload === void 0 ? void 0 : payload.status,
            },
        });
        return userInfo;
    }));
    return result;
});
const findMyProfileDB = (tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.email,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            isDelete: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            userProfile: true,
            shopFollow: {
                select: {
                    shop: {
                        select: {
                            name: true,
                            logo: true,
                        },
                    },
                },
            },
        },
    });
    return user;
});
const updateMyProfileDB = (tokenUser, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = body, payload = __rest(body, ["name"]);
    const user = yield prisma.user.findUniqueOrThrow({
        where: {
            email: tokenUser.email,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
    });
    if (body.status || body.role) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can't change role and status");
    }
    if (name) {
        yield prisma.user.update({
            where: { email: user.email },
            data: {
                name,
            },
        });
    }
    const userProfile = yield prisma.userProfile.update({
        where: { email: user.email },
        data: payload,
    });
    return userProfile;
});
const getSingleUserDB = (paramsId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findUniqueOrThrow({
        where: {
            id: paramsId,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
        select: {
            email: true,
            id: true,
            role: true,
            name: true,
            isDelete: true,
            createdAt: true,
            lastPasswordChange: true,
            status: true,
            updatedAt: true,
            userProfile: true,
        },
    });
    return result;
});
const createWishlistDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.wishlist.create({
        data: {
            userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            productId: payload === null || payload === void 0 ? void 0 : payload.productId,
        },
    });
    return result;
});
const findUserAllWishListDB = (queryObj, options, tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: User_const_1.userWishListSearchAbleFields === null || User_const_1.userWishListSearchAbleFields === void 0 ? void 0 : User_const_1.userWishListSearchAbleFields.map((field) => ({
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
    const result = yield prisma.wishlist.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id }),
        select: {
            product: true,
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
    const total = yield prisma.wishlist.count({
        where: Object.assign(Object.assign({}, whereConditions), { userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id }),
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
exports.userService = {
    getAllUsersDB,
    adminUpdateUserDB,
    findMyProfileDB,
    updateMyProfileDB,
    getSingleUserDB,
    findUserAllWishListDB,
    createWishlistDB,
};
