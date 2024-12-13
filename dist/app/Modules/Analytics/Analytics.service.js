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
exports.analyticsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const date_fns_1 = require("date-fns");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const http_status_codes_1 = require("http-status-codes");
const adminAnalyticsDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregate revenue grouped by months
    const monthlyRevenue = yield prisma_1.default.payment.groupBy({
        by: ["createdAt"],
        _sum: {
            amount: true,
        },
        where: {
            createdAt: {
                gte: new Date(new Date().getFullYear(), 0, 1), // From January 1st of this year
            },
            paymentStatus: "confirm", // Only confirmed payments
        },
    });
    // Format the data to group by months
    const revenueByMonth = Array(12)
        .fill(0)
        .map((_, i) => ({
        month: (0, date_fns_1.format)(new Date(new Date().getFullYear(), i, 1), "MMMM"), // Full month name
        revenue: 0,
    }));
    // Populate revenue in the correct month
    for (const record of monthlyRevenue) {
        const monthIndex = new Date(record.createdAt).getMonth();
        revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
    }
    //! payment status base info
    // Count payments grouped by status
    const statusCounts = yield prisma_1.default.payment.groupBy({
        by: ["paymentStatus"],
        _count: {
            paymentStatus: true,
        },
    });
    // Format the result
    const paymentStatusBaseInfo = statusCounts.reduce((acc, record) => {
        acc[record.paymentStatus] = record._count.paymentStatus;
        return acc;
    }, { confirm: 0, pending: 0, cancel: 0 });
    //! use status base info
    const totalUsers = yield prisma_1.default.user.count();
    // Active and blocked user count
    const userStatusCounts = yield prisma_1.default.user.groupBy({
        by: ["status"],
        _count: {
            status: true,
        },
    });
    // Format the result
    const formattedCounts = userStatusCounts.reduce((acc, record) => {
        acc[record.status] = record._count.status;
        return acc;
    }, { active: 0, blocked: 0 });
    // ! shop isDelete base data
    // Total shop count
    const totalShops = yield prisma_1.default.shop.count();
    // Active and deactive shop count
    const shopStatusCounts = yield prisma_1.default.shop.groupBy({
        by: ["isDelete"],
        _count: {
            isDelete: true,
        },
    });
    // Format the result
    const formattedCountShop = shopStatusCounts.reduce((acc, record) => {
        if (record.isDelete) {
            acc.deactive = record._count.isDelete;
        }
        else {
            acc.active = record._count.isDelete;
        }
        return acc;
    }, { active: 0, deactive: 0 });
    return {
        revenueByMonth,
        paymentStatusBaseInfo,
        userInfo: Object.assign({ totalUsers }, formattedCounts),
        shopInfo: Object.assign({ totalShops }, formattedCountShop),
    };
});
//! shop analytics
const shopAnalyticsDB = (tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (!findShop) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found");
    }
    const shopId = (_b = findShop === null || findShop === void 0 ? void 0 : findShop.shop) === null || _b === void 0 ? void 0 : _b.id;
    // Total revenue
    const totalRevenueData = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            shopId,
            paymentStatus: "confirm",
        },
    });
    //   monthly revenue
    const monthlyRevenue = yield prisma_1.default.payment.groupBy({
        by: ["createdAt"],
        _sum: {
            amount: true,
        },
        where: {
            shopId: shopId,
            createdAt: {
                gte: new Date(new Date().getFullYear(), 0, 1), // From January 1st of this year
            },
            paymentStatus: "confirm", // Only confirmed payments
        },
    });
    // Format the data to group by months
    const revenueByMonth = Array(12)
        .fill(0)
        .map((_, i) => ({
        month: (0, date_fns_1.format)(new Date(new Date().getFullYear(), i, 1), "MMMM"), // Full month name
        revenue: 0,
    }));
    // Populate revenue in the correct month
    for (const record of monthlyRevenue) {
        const monthIndex = new Date(record.createdAt).getMonth();
        revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
    }
    //! product data
    // Total active products
    const totalActiveProducts = yield prisma_1.default.product.count({
        where: {
            shopId,
            isDelete: false,
        },
    });
    // Total inactive products
    const totalInactiveProducts = yield prisma_1.default.product.count({
        where: {
            shopId,
            isDelete: true,
        },
    });
    // Total products with flash sale active
    const totalFlashSaleProducts = yield prisma_1.default.product.count({
        where: {
            shopId,
            isFlashSaleOffer: true,
        },
    });
    return {
        totalRevenueData,
        revenueByMonth,
        totalActiveProducts,
        totalInactiveProducts,
        totalFlashSaleProducts,
    };
});
exports.analyticsService = { adminAnalyticsDB, shopAnalyticsDB };
