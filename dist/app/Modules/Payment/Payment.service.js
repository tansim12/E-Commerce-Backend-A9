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
exports.paymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Payment_const_1 = require("./Payment.const");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const verifyPayment_1 = require("../../utils/verifyPayment");
const AppError_1 = __importDefault(require("../../Error-Handler/AppError"));
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helper/paginationHelper");
const paymentDB = (tokenUser, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
        },
    });
    // console.log(body);
    const initialShopId = (_a = body === null || body === void 0 ? void 0 : body[0]) === null || _a === void 0 ? void 0 : _a.shopId;
    const shopId = body === null || body === void 0 ? void 0 : body.find((item) => {
        if (initialShopId !== (item === null || item === void 0 ? void 0 : item.shopId)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.ACCEPTED, "ShopId not match");
        }
    });
    const usedPromoProductIds = (_b = body === null || body === void 0 ? void 0 : body.filter((item) => (item === null || item === void 0 ? void 0 : item.isPromoUse) === true) // Filter items where isPromoUse is true
    ) === null || _b === void 0 ? void 0 : _b.map((item) => item.id); // Map to extract the id of each filtered item
    // db থেকে প্রোডাক্ট বের করছি
    const findWithPromoProducts = yield prisma_1.default.product.findMany({
        where: {
            isDelete: false,
            isAvailable: true,
            id: {
                in: usedPromoProductIds,
            },
        },
        select: {
            id: true,
            price: true,
            flashSaleDiscount: true,
            quantity: true,
        },
    });
    // promo code use করা  গুলোর quantity আলাদা করছি
    const usedPromoProductIdAndBuyQuantity = (_c = body === null || body === void 0 ? void 0 : body.filter((item) => (item === null || item === void 0 ? void 0 : item.isPromoUse) === true) // Filter items where isPromoUse is true
    ) === null || _c === void 0 ? void 0 : _c.map((item) => ({
        id: item === null || item === void 0 ? void 0 : item.id,
        buyQuantity: item === null || item === void 0 ? void 0 : item.buyQuantity,
    })); // Map to extract the id of each filtered item
    // console.log({ usedPromoProductIdAndBuyQuantity });
    const withPromoProductCalculationResult = usedPromoProductIdAndBuyQuantity
        .map((promoItem) => {
        const product = findWithPromoProducts.find((item) => item.id === promoItem.id);
        if (product) {
            const totalBuyQuantity = Math.min(promoItem.buyQuantity, product.quantity); // বড় হলে, স্টকের সীমায় রাখুন
            const totalPrice = totalBuyQuantity * (product.price - (product.flashSaleDiscount || 0)); // price + flashSaleDiscount
            return {
                id: promoItem.id,
                totalBuyQuantity,
                totalPrice,
            };
        }
        return null; // যদি প্রোডাক্ট না মেলে
    })
        .filter(Boolean); // null বা undefined বাদ দিন
    //!
    const normalProductIds = (_d = body === null || body === void 0 ? void 0 : body.filter((item) => (item === null || item === void 0 ? void 0 : item.isPromoUse) !== true) // Filter items where isPromoUse is true
    ) === null || _d === void 0 ? void 0 : _d.map((item) => item.id); // Map to extract the id of each filtered item
    const findWithOutPromoProducts = yield prisma_1.default.product.findMany({
        where: {
            isDelete: false,
            isAvailable: true,
            id: {
                in: normalProductIds,
            },
        },
        select: {
            id: true,
            price: true,
            discount: true,
            quantity: true,
        },
    });
    // promo code use করা  গুলোর quantity আলাদা করছি
    const normalBuyQuantity = (_e = body === null || body === void 0 ? void 0 : body.filter((item) => (item === null || item === void 0 ? void 0 : item.isPromoUse) !== true) // Filter items where isPromoUse is true
    ) === null || _e === void 0 ? void 0 : _e.map((item) => ({
        id: item === null || item === void 0 ? void 0 : item.id,
        buyQuantity: item === null || item === void 0 ? void 0 : item.buyQuantity,
    })); // Map to extract the id of each filtered item
    const normalProductCalculationResult = normalBuyQuantity
        .map((promoItem) => {
        const product = findWithOutPromoProducts.find((item) => item.id === promoItem.id);
        if (product) {
            const totalBuyQuantity = Math.min(promoItem.buyQuantity, product.quantity); // বড় হলে, স্টকের সীমায় রাখুন
            const totalPrice = totalBuyQuantity * (product.price - (product.discount || 0)); // price + flashSaleDiscount
            return {
                id: promoItem.id,
                totalBuyQuantity,
                totalPrice,
            };
        }
        return null; // যদি প্রোডাক্ট না মেলে
    })
        .filter(Boolean); // null বা undefined বাদ দিন
    //! this is important
    // console.log({
    //   normalProductCalculationResult,
    //   withPromoProductCalculationResult,
    // });
    const normalTotalPrice = (normalProductCalculationResult === null || normalProductCalculationResult === void 0 ? void 0 : normalProductCalculationResult.reduce((acc, item) => acc + (item === null || item === void 0 ? void 0 : item.totalPrice), 0)) || 0;
    const promoTotalPrice = (withPromoProductCalculationResult === null || withPromoProductCalculationResult === void 0 ? void 0 : withPromoProductCalculationResult.reduce((acc, item) => acc + (item === null || item === void 0 ? void 0 : item.totalPrice), 0)) || 0;
    const mainTotalPrice = normalTotalPrice + promoTotalPrice;
    // return mainTotalPrice;
    // console.log({ mainTotalPrice });
    const transactionId = (0, uuid_1.v7)(); // Generate a UUID
    const currentTime = new Date().toISOString(); // or use Date.now() for a timestamp in milliseconds
    // Concatenate UUID with current time
    const combinedTransactionId = `${transactionId}-${currentTime}`;
    // db save
    // const initialDataCreate = await prisma.$transaction(async (tx) => {
    //   const createPayment = await tx.payment.create({
    //     data: {
    //       shopId: initialShopId,
    //       amount: mainTotalPrice,
    //       txId: combinedTransactionId,
    //       userId: tokenUser?.id,
    //     },
    //   });
    //   // normalProductCalculationResult
    //   if (normalProductCalculationResult?.length) {
    //     normalProductCalculationResult?.map(async (item: any) => {
    //       await tx.paymentAndProduct.create({
    //         data: {
    //           productId: item?.id,
    //           selectQuantity: item?.totalBuyQuantity,
    //           payTotalAmount: item?.totalPrice,
    //           paymentId: createPayment?.id,
    //         },
    //       });
    //     });
    //   }
    //   // withPromoProductCalculationResult
    //   if (withPromoProductCalculationResult?.length) {
    //     withPromoProductCalculationResult?.map(async (item: any) => {
    //       await tx.paymentAndProduct.create({
    //         data: {
    //           productId: item?.id,
    //           selectQuantity: item?.totalBuyQuantity,
    //           payTotalAmount: item?.totalPrice,
    //           paymentId: createPayment?.id,
    //         },
    //       });
    //     });
    //   }
    //   return createPayment;
    // });
    const initialDataCreate = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createPayment = yield tx.payment.create({
            data: {
                shopId: initialShopId,
                amount: mainTotalPrice,
                txId: combinedTransactionId,
                userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            },
        });
        // Create entries in paymentAndProduct for normal products
        if (normalProductCalculationResult === null || normalProductCalculationResult === void 0 ? void 0 : normalProductCalculationResult.length) {
            const normalProductPromises = normalProductCalculationResult.map((item) => {
                return tx.paymentAndProduct.create({
                    data: {
                        productId: item === null || item === void 0 ? void 0 : item.id,
                        selectQuantity: item === null || item === void 0 ? void 0 : item.totalBuyQuantity,
                        payTotalAmount: item === null || item === void 0 ? void 0 : item.totalPrice,
                        paymentId: createPayment === null || createPayment === void 0 ? void 0 : createPayment.id,
                    },
                });
            });
            // Wait for all normal product inserts to complete
            yield Promise.all(normalProductPromises);
        }
        // Create entries in paymentAndProduct for promo products
        if (withPromoProductCalculationResult === null || withPromoProductCalculationResult === void 0 ? void 0 : withPromoProductCalculationResult.length) {
            const promoProductPromises = withPromoProductCalculationResult.map((item) => {
                return tx.paymentAndProduct.create({
                    data: {
                        productId: item === null || item === void 0 ? void 0 : item.id,
                        selectQuantity: item === null || item === void 0 ? void 0 : item.totalBuyQuantity,
                        payTotalAmount: item === null || item === void 0 ? void 0 : item.totalPrice,
                        paymentId: createPayment === null || createPayment === void 0 ? void 0 : createPayment.id,
                    },
                });
            });
            // Wait for all promo product inserts to complete
            yield Promise.all(promoProductPromises);
        }
        return createPayment;
    }));
    if (!initialDataCreate) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Initial Db insert failed");
    }
    const formData = {
        cus_name: `${(user === null || user === void 0 ? void 0 : user.name) ? user === null || user === void 0 ? void 0 : user.name : "N/A"}`,
        cus_email: `${(user === null || user === void 0 ? void 0 : user.email) ? user === null || user === void 0 ? void 0 : user.email : "N/A"}`,
        cus_phone: `${"N/A"}`,
        amount: initialDataCreate === null || initialDataCreate === void 0 ? void 0 : initialDataCreate.amount,
        tran_id: combinedTransactionId,
        signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
        store_id: "aamarpaytest",
        currency: "BDT",
        desc: combinedTransactionId,
        cus_add1: "N/A",
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_country: "Bangladesh",
        success_url: `${process.env.BASE_URL}/api/payment/callback?txnId=${combinedTransactionId}&userId=${user === null || user === void 0 ? void 0 : user.id}&paymentId=${initialDataCreate === null || initialDataCreate === void 0 ? void 0 : initialDataCreate.id}`,
        fail_url: `${process.env.BASE_URL}/api/payment/callback`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`, // its redirect to frontend directly
        type: "json", //This is must required for JSON request
    };
    const { data } = yield axios_1.default.post(`${process.env.AAMAR_PAY_HIT_API}`, formData);
    if (data.result !== "true") {
        let errorMessage = "";
        for (const key in data) {
            errorMessage += data[key] + ". ";
        }
        return errorMessage;
    }
    return {
        url: data.payment_url,
    };
});
const callbackDB = (body, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (body && (body === null || body === void 0 ? void 0 : body.status_code) === "7") {
        return {
            success: false,
        };
    }
    const { paymentId, userId, txnId } = query;
    const paymentInfo = yield prisma_1.default.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
        },
        include: {
            paymentAndProduct: true,
        },
    });
    try {
        if (body && (body === null || body === void 0 ? void 0 : body.status_code) === "2") {
            const verifyPaymentData = yield (0, verifyPayment_1.verifyPayment)(query === null || query === void 0 ? void 0 : query.txnId);
            if (verifyPaymentData && (verifyPaymentData === null || verifyPaymentData === void 0 ? void 0 : verifyPaymentData.status_code) === "2") {
                // Destructuring the necessary data
                const { approval_code, payment_type, amount, cus_phone, mer_txnid } = verifyPaymentData;
                // Prepare the payment data
                // Update user isVerified field
                const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    const paymentAndProductIds = paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.paymentAndProduct.map((item) => item === null || item === void 0 ? void 0 : item.id);
                    const productsUpdateInfo = paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.paymentAndProduct.map((item) => ({
                        productId: item === null || item === void 0 ? void 0 : item.productId,
                        selectQuantity: item === null || item === void 0 ? void 0 : item.selectQuantity,
                    }));
                    const updatePayment = yield tx.payment.update({
                        where: {
                            id: paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.id,
                        },
                        data: {
                            amount: Number(amount),
                            approval_code: approval_code,
                            payment_type: payment_type,
                            paymentStatus: client_1.PaymentStatus.confirm,
                            mer_txnid: mer_txnid,
                        },
                    });
                    // update
                    yield tx.paymentAndProduct.updateMany({
                        where: {
                            id: {
                                in: paymentAndProductIds,
                            },
                        },
                        data: {
                            paymentStatus: client_1.PaymentStatus.confirm,
                        },
                    });
                    // update product quantity and buyQuantity increment
                    const productUpdatePromise = productsUpdateInfo === null || productsUpdateInfo === void 0 ? void 0 : productsUpdateInfo.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                        const product = yield prisma_1.default.product.findUnique({
                            where: {
                                id: item === null || item === void 0 ? void 0 : item.productId,
                            },
                        });
                        if ((product === null || product === void 0 ? void 0 : product.quantity) < (item === null || item === void 0 ? void 0 : item.selectQuantity)) {
                            yield tx.product.update({
                                where: {
                                    id: item === null || item === void 0 ? void 0 : item.productId,
                                },
                                data: {
                                    quantity: 0,
                                    isAvailable: false,
                                    totalBuy: (product === null || product === void 0 ? void 0 : product.totalBuy) + (item === null || item === void 0 ? void 0 : item.selectQuantity),
                                },
                            });
                        }
                        if ((product === null || product === void 0 ? void 0 : product.quantity) - (item === null || item === void 0 ? void 0 : item.selectQuantity) === 0) {
                            yield tx.product.update({
                                where: {
                                    id: item === null || item === void 0 ? void 0 : item.productId,
                                },
                                data: {
                                    quantity: (product === null || product === void 0 ? void 0 : product.quantity) - (item === null || item === void 0 ? void 0 : item.selectQuantity),
                                    isAvailable: false,
                                    totalBuy: (product === null || product === void 0 ? void 0 : product.totalBuy) + (item === null || item === void 0 ? void 0 : item.selectQuantity),
                                },
                            });
                        }
                        else {
                            yield tx.product.update({
                                where: {
                                    id: item === null || item === void 0 ? void 0 : item.productId,
                                },
                                data: {
                                    quantity: (product === null || product === void 0 ? void 0 : product.quantity) - (item === null || item === void 0 ? void 0 : item.selectQuantity),
                                    totalBuy: (product === null || product === void 0 ? void 0 : product.totalBuy) + (item === null || item === void 0 ? void 0 : item.selectQuantity),
                                },
                            });
                        }
                    }));
                    // Wait for all normal product inserts to complete
                    yield Promise.all(productUpdatePromise);
                    return updatePayment;
                }));
                //! Save the payment info
                // Commit the transaction
                if (!result) {
                    return {
                        success: false,
                    };
                }
                return {
                    success: true,
                    txnId: query === null || query === void 0 ? void 0 : query.txnId,
                };
            }
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.PRECONDITION_FAILED, "Payment Failed"); // Rethrow the error to handle it outside the function
    }
});
const myAllPaymentInfoDB = (tokenUser, queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.payment.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id, NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
            } }),
        include: {
            paymentAndProduct: {
                include: {
                    product: {
                        select: {
                            productName: true,
                            images: true,
                        },
                    },
                },
            },
            productReview: true
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
    const total = yield prisma_1.default.payment.count({
        where: Object.assign(Object.assign({}, whereConditions), { userId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id, NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
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
// admin all payments
const allPaymentInfoDB = (queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.payment.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
            } }),
        include: {
            paymentAndProduct: {
                include: {
                    product: {
                        select: {
                            productName: true,
                            images: true,
                        },
                    },
                },
            },
            productReview: true,
            _count: {
                select: {
                    productReview: true,
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
    const total = yield prisma_1.default.payment.count({
        where: Object.assign(Object.assign({}, whereConditions), { NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
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
// shop  all payments
const shopAllPaymentDB = (tokenUser, queryObj, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = queryObj, filterData = __rest(queryObj, ["searchTerm"]);
    const andCondition = [];
    if (queryObj.searchTerm) {
        andCondition.push({
            OR: Payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.payment.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
            }, shop: {
                vendorId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
            } }),
        include: {
            paymentAndProduct: {
                include: {
                    product: {
                        select: {
                            productName: true,
                            images: true,
                        },
                    },
                },
            },
            productReview: true,
            _count: {
                select: {
                    productReview: true,
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
    const total = yield prisma_1.default.payment.count({
        where: Object.assign(Object.assign({}, whereConditions), { NOT: {
                paymentStatus: client_1.PaymentStatus.pending,
            }, shop: {
                vendorId: tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id,
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
const adminAndVendorUpdatePaymentDB = (paymentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paymentInfo = yield prisma_1.default.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
        },
        include: {
            paymentAndProduct: true,
        },
    });
    const paymentAndProductIds = (_a = paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.paymentAndProduct) === null || _a === void 0 ? void 0 : _a.map((item) => item === null || item === void 0 ? void 0 : item.id);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatePaymentStatus = yield tx.payment.update({
            where: {
                id: paymentId,
            },
            data: {
                paymentStatus: payload === null || payload === void 0 ? void 0 : payload.paymentStatus,
            },
        });
        yield tx.paymentAndProduct.updateMany({
            where: {
                id: {
                    in: paymentAndProductIds,
                },
            },
            data: {
                paymentStatus: payload === null || payload === void 0 ? void 0 : payload.paymentStatus,
            },
        });
        return updatePaymentStatus;
    }));
    return result;
});
exports.paymentService = {
    paymentDB,
    callbackDB,
    myAllPaymentInfoDB,
    allPaymentInfoDB,
    adminAndVendorUpdatePaymentDB,
    shopAllPaymentDB,
};
