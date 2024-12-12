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
exports.productService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const Product_const_1 = require("./Product.const");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createProductDB = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            isDelete: false,
            shop: {
                vendorId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
                isDelete: false,
            },
        },
        select: {
            shop: {
                select: {
                    id: true,
                },
            },
        },
    });
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, payload), { shopId: (_a = vendorInfo === null || vendorInfo === void 0 ? void 0 : vendorInfo.shop) === null || _a === void 0 ? void 0 : _a.id }),
    });
    return result;
});
const updateProductDB = (tokenUser, productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const IsVendor = yield prisma_1.default.user.findUnique({
        where: {
            id: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            isDelete: false,
            status: client_1.UserStatus.active,
        },
    });
    if ((IsVendor === null || IsVendor === void 0 ? void 0 : IsVendor.role) === client_1.UserRole.vendor) {
        yield prisma_1.default.product.findUniqueOrThrow({
            where: {
                id: productId,
                shop: {
                    vendorId: IsVendor === null || IsVendor === void 0 ? void 0 : IsVendor.id,
                    isDelete: false,
                },
            },
        });
    }
    const result = yield prisma_1.default.product.update({
        where: {
            id: productId,
        },
        data: payload,
    });
    return result;
});
const findVendorShopAllProductsDB = (tokenUser, queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Product_const_1.shopAllProductsSearchAbleFields === null || Product_const_1.shopAllProductsSearchAbleFields === void 0 ? void 0 : Product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
    const vendorInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            isDelete: false,
            shop: {
                vendorId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
                isDelete: false,
            },
        },
        select: {
            shop: {
                select: {
                    id: true,
                },
            },
        },
    });
    const result = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            // ...whereConditions,
            id: (_a = vendorInfo === null || vendorInfo === void 0 ? void 0 : vendorInfo.shop) === null || _a === void 0 ? void 0 : _a.id,
        },
        include: {
            product: {
                where: Object.assign({}, whereConditions),
                include: {
                    category: {
                        select: {
                            categoryName: true,
                            id: true,
                        },
                    },
                    subCategory: {
                        select: {
                            categoryName: true,
                            id: true,
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
            },
        },
    });
    const total = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            // ...whereConditions,
            id: (_b = vendorInfo === null || vendorInfo === void 0 ? void 0 : vendorInfo.shop) === null || _b === void 0 ? void 0 : _b.id,
        },
        include: {
            product: {
                where: Object.assign({}, whereConditions),
                select: {
                    id: true,
                },
            },
        },
    });
    const meta = {
        page,
        limit,
        total: total.product.length,
    };
    return {
        meta,
        result,
    };
});
const adminFindAllProductsDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign({}, whereConditions),
        include: {
            category: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            subCategory: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            shop: {
                select: {
                    name: true,
                    id: true,
                    logo: true,
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
    const total = yield prisma_1.default.product.count({
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
const publicTopSaleProductDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDelete: false, isAvailable: true, quantity: {
                gt: 1,
            } }),
        include: {
            category: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            subCategory: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            shop: {
                select: {
                    name: true,
                    id: true,
                    logo: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            totalBuy: "desc",
        },
    });
    const total = yield prisma_1.default.product.count({
        where: Object.assign(Object.assign({}, whereConditions), { isDelete: false, isAvailable: true }),
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
const publicSingleProductDb = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDelete: false,
        },
        include: {
            category: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            subCategory: {
                select: {
                    categoryName: true,
                    id: true,
                },
            },
            shop: {
                select: {
                    logo: true,
                    name: true,
                    _count: true,
                    shopType: true,
                },
            },
        },
    });
    const relatedProduct = yield prisma_1.default.product.findMany({
        where: {
            OR: [
                {
                    categoryId: result.categoryId,
                },
                {
                    subCategoryId: result.subCategoryId,
                },
            ],
            NOT: {
                id: result.id,
            },
        },
        take: 5,
        orderBy: {
            updatedAt: "desc",
        },
    });
    return {
        result,
        relatedProduct,
    };
});
const publicFlashSaleProductDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.product.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { isDelete: false, isAvailable: true, 
            // flash sale হওয়ার condition
            isActivePromo: true, promo: {
                not: null,
            }, flashSaleDiscount: {
                not: null,
            }, flashSaleEndDate: {
                not: null,
            }, flashSaleStartDate: {
                not: null,
            }, isFlashSaleOffer: true, quantity: {
                gt: 1,
            } }),
        skip,
        take: limit,
        orderBy: {
            updatedAt: "desc",
        },
    });
    const total = yield prisma_1.default.product.count({
        where: Object.assign(Object.assign({}, whereConditions), { isDelete: false, isAvailable: true, 
            // flash sale হওয়ার condition
            isActivePromo: true, promo: {
                not: null,
            }, flashSaleDiscount: {
                not: null,
            }, flashSaleEndDate: {
                not: null,
            }, flashSaleStartDate: {
                not: null,
            }, isFlashSaleOffer: true, quantity: {
                gt: 1,
            } }),
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
const publicPromoCheckDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const product = yield prisma_1.default.product.findFirst({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.id,
            isDelete: false,
            shopId: payload === null || payload === void 0 ? void 0 : payload.shopId,
            isAvailable: true,
            // Flash Sale শর্ত
            isActivePromo: true,
            promo: {
                contains: payload === null || payload === void 0 ? void 0 : payload.promo,
            },
            flashSaleDiscount: {
                not: null,
            },
            AND: [
                {
                    flashSaleStartDate: {
                        lte: currentDate, // শুরু হয়েছে বা আজ শুরু
                    },
                },
                {
                    flashSaleEndDate: {
                        gte: currentDate, // এখনো চলছে বা আজ শেষ
                    },
                },
            ],
            isFlashSaleOffer: true,
            quantity: {
                gt: 1,
            },
        },
    });
    if (!product) {
        return {
            status: 400,
            message: "This Promo Not Available",
        };
    }
    return {
        status: 200,
        message: "Congratulations, you got a discount!",
        newUnitPrice: (product === null || product === void 0 ? void 0 : product.price) - (product === null || product === void 0 ? void 0 : product.flashSaleDiscount),
        id: product === null || product === void 0 ? void 0 : product.id,
    };
});
// const publicAllProductsDB = async (
//   queryObj: any,
//   options: IPaginationOptions
// ) => {
//   const { page, limit, skip } = paginationHelper.calculatePagination(options);
//   const { searchTerm, priceStart, priceEnd, ...filterData } = queryObj;
//   console.log(typeof priceStart);
//   const andCondition = [];
//   if (queryObj.searchTerm) {
//     andCondition.push({
//       OR: shopAllProductsSearchAbleFields.map((field) => ({
//         [field]: {
//           contains: queryObj.searchTerm,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }
//   if (Object.keys(filterData).length > 0) {
//     if (filterData?.isAvailable) {
//       if (
//         typeof filterData?.isAvailable === "string" &&
//         filterData?.isAvailable === "false"
//       ) {
//         filterData.isAvailable = false;
//       }
//       if (
//         typeof filterData?.isAvailable === "string" &&
//         filterData?.isAvailable === "true"
//       ) {
//         filterData.isAvailable = true;
//       }
//     }
//     andCondition.push({
//       AND: Object.keys(filterData).map((key) => ({
//         [key]: {
//           equals: filterData[key as never],
//         },
//       })),
//     });
//   }
//   const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };
//   const result = await prisma.product.findMany({
//     where: {
//       ...(whereConditions as any),
//       isDelete: false,
//       AND: [
//         {
//           price: {
//             gte: Number(priceStart), // Price should be greater than or equal to priceStart
//           },
//         },
//         {
//           price: {
//             lte: Number(priceEnd), // Price should be less than or equal to priceEnd
//           },
//         },
//       ],
//     },
//     include: {
//       category: true,
//       subCategory: true,
//     },
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: "desc",
//           },
//   });
//   const total = await prisma.product.count({
//     where: {
//       ...(whereConditions as any),
//       isDelete: false,
//       AND: [
//         {
//           price: {
//             gte: Number(priceStart), // Price should be greater than or equal to priceStart
//           },
//         },
//         {
//           price: {
//             lte: Number(priceEnd), // Price should be less than or equal to priceEnd
//           },
//         },
//       ],
//     },
//   });
//   const meta = {
//     page,
//     limit,
//     total,
//   };
//   return {
//     meta,
//     result,
//   };
// };
const publicAllProductsDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, priceStart, priceEnd } = queryObj, filterData = __rest(queryObj, ["searchTerm", "priceStart", "priceEnd"]);
    const andCondition = [];
    // Search term condition
    if (searchTerm) {
        andCondition.push({
            OR: Product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // Filter conditions
    if (Object.keys(filterData).length > 0) {
        if (filterData === null || filterData === void 0 ? void 0 : filterData.isAvailable) {
            filterData.isAvailable =
                typeof filterData.isAvailable === "string"
                    ? filterData.isAvailable === "true"
                    : filterData.isAvailable;
        }
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // Price range filter (conditionally added)
    if (priceStart !== undefined || priceEnd !== undefined) {
        const priceConditions = [];
        if (priceStart !== undefined) {
            priceConditions.push({
                price: {
                    gte: Number(priceStart),
                },
            });
        }
        if (priceEnd !== undefined) {
            priceConditions.push({
                price: {
                    lte: Number(priceEnd),
                },
            });
        }
        andCondition.push(...priceConditions);
    }
    const whereConditions = {
        AND: andCondition,
        isDelete: false, // Always exclude deleted products
    };
    // Fetch filtered products
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        include: {
            category: true,
            subCategory: true,
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
    // Count total filtered products
    const total = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    return {
        meta: { page, limit, total },
        result,
    };
});
const publicCompareProductDB = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    if ((productIds === null || productIds === void 0 ? void 0 : productIds.length) > 3) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "Longer then 3");
    }
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDelete: false,
            id: {
                in: productIds,
            },
        },
        include: {
            category: true,
        },
    });
    return result;
});
const findRelevantProductDB = (categoryIds, queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    if ((categoryIds === null || categoryIds === void 0 ? void 0 : categoryIds.length) > 0) {
        const result = yield prisma_1.default.product.findMany({
            where: {
                isDelete: false,
                categoryId: {
                    in: categoryIds,
                },
            },
            skip,
            take: limit,
            orderBy: {
                updatedAt: "desc",
            },
        });
        const total = yield prisma_1.default.product.count({
            where: {
                isDelete: false,
                categoryId: {
                    in: categoryIds,
                },
            },
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
    }
    else {
        const result = yield prisma_1.default.product.findMany({
            where: {
                isDelete: false,
            },
            orderBy: {
                updatedAt: "desc",
            },
            skip,
            take: limit,
        });
        const total = yield prisma_1.default.product.count();
        const meta = {
            page,
            limit,
            total,
        };
        return {
            meta,
            result,
        };
    }
});
exports.productService = {
    createProductDB,
    updateProductDB,
    findVendorShopAllProductsDB,
    adminFindAllProductsDB,
    publicTopSaleProductDB,
    publicSingleProductDb,
    publicFlashSaleProductDB,
    publicPromoCheckDB,
    publicAllProductsDB,
    publicCompareProductDB,
    findRelevantProductDB,
};
