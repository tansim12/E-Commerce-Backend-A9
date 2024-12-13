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
exports.shopService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const Shop_const_1 = require("./Shop.const");
const crateShopDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser.id,
            isDelete: false,
            OR: [
                {
                    role: client_1.UserRole.admin,
                },
                {
                    role: client_1.UserRole.vendor,
                },
            ],
        },
    });
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.vendorId,
            isDelete: false,
            OR: [
                {
                    role: client_1.UserRole.vendor,
                },
            ],
        },
    });
    const result = yield prisma_1.default.shop.create({
        data: payload,
    });
    return result;
});
const findSingleShopPublicDB = (shopId, queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDelete: false,
        },
        include: {
            shopReview: true,
            vendor: {
                select: {
                    name: true,
                    email: true,
                    userProfile: {
                        select: {
                            profilePhoto: true,
                        },
                    },
                },
            },
            shopFollow: true,
            _count: true,
            product: {
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            },
        },
    });
    const total = yield prisma_1.default.shop.count({
        where: {
            id: shopId,
            isDelete: false,
        },
    });
    const meta = {
        page,
        limit,
        total: (_a = result === null || result === void 0 ? void 0 : result._count) === null || _a === void 0 ? void 0 : _a.product,
    };
    return {
        meta,
        result,
    };
});
// public all shop get
const findAllShopPublicDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Shop_const_1.shopSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.shop.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDelete: false }),
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
    const total = yield prisma_1.default.shop.count({
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
// following and review section
const shopFollowingDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser.id,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
    });
    if ((payload === null || payload === void 0 ? void 0 : payload.isDelete) === false) {
        const result = yield prisma_1.default.shopFollow.upsert({
            where: {
                userId_shopId: {
                    shopId: payload === null || payload === void 0 ? void 0 : payload.shopId,
                    userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                },
            },
            update: Object.assign(Object.assign({}, payload), { userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id }),
            create: Object.assign(Object.assign({}, payload), { userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id }),
        });
        return result;
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.isDelete) === true) {
        const result = yield prisma_1.default.shopFollow.delete({
            where: {
                userId_shopId: {
                    shopId: payload === null || payload === void 0 ? void 0 : payload.shopId,
                    userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                },
            },
        });
        return result;
    }
});
const shopReviewDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser.id,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
    });
    if ((payload === null || payload === void 0 ? void 0 : payload.isDelete) === false) {
        const result = yield prisma_1.default.shopReview.upsert({
            where: {
                userId_shopId: {
                    shopId: payload === null || payload === void 0 ? void 0 : payload.shopId,
                    userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                },
            },
            update: Object.assign(Object.assign({}, payload), { userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id }),
            create: Object.assign(Object.assign({}, payload), { userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id }),
        });
        return result;
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.isDelete) === true) {
        const result = yield prisma_1.default.shopReview.delete({
            where: {
                userId_shopId: {
                    shopId: payload === null || payload === void 0 ? void 0 : payload.shopId,
                    userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                },
            },
        });
        return result;
    }
});
const vendorFindHisShopDB = (tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUnique({
        where: {
            vendorId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
        },
    });
    return result;
});
const updateShopInfoDB = (tokenUser, shopId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isVendor = yield prisma_1.default.user.findUnique({
        where: {
            id: tokenUser.id,
            role: client_1.UserRole.vendor,
        },
    });
    if (isVendor) {
        yield prisma_1.default.shop.findUniqueOrThrow({
            where: {
                id: shopId,
                vendorId: isVendor === null || isVendor === void 0 ? void 0 : isVendor.id,
            },
        });
    }
    const { vendorId, id } = payload, newPayload = __rest(payload, ["vendorId", "id"]);
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopId,
        },
        data: newPayload,
    });
    return result;
});
// public all shop get
const adminFindAllShopDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Shop_const_1.shopSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.shop.findMany({
        where: Object.assign({}, whereConditions),
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
    const total = yield prisma_1.default.shop.count({
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
const findSingleUserFollowDB = (tokenUser, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shopFollow.findFirst({
        where: {
            userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            shopId,
        },
    });
    if (!result) {
        return {
            status: 201,
            message: "No Table create",
        };
    }
    return result;
});
const isShopExistDb = (tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const findShop = yield ((_a = prisma_1.default.user) === null || _a === void 0 ? void 0 : _a.findUnique({
        where: {
            id: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            isDelete: false,
            role: client_1.UserRole.vendor,
        },
        select: {
            shop: {
                select: {
                    id: true,
                },
            },
        },
    }));
    if (!((_b = findShop === null || findShop === void 0 ? void 0 : findShop.shop) === null || _b === void 0 ? void 0 : _b.id)) {
        return {
            status: 400,
            message: "Please shop Create First",
        };
    }
    return {
        status: 200,
        message: "Shop Exist",
    };
});
exports.shopService = {
    crateShopDB,
    findAllShopPublicDB,
    findSingleShopPublicDB,
    shopFollowingDB,
    shopReviewDB,
    vendorFindHisShopDB,
    updateShopInfoDB,
    adminFindAllShopDB,
    findSingleUserFollowDB,
    isShopExistDb,
};
