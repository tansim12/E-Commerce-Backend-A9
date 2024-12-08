/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import { v7 as uuidv7 } from "uuid";

import { TPaymentInfo } from "./payment.interface";

import { paymentInfoSearchTerm } from "./Payment.const";
import prisma from "../../shared/prisma";
import { verifyPayment } from "../../utils/verifyPayment";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";

interface TUpdatePaymentPayload {
  isDecline?: boolean;
  isVerified?: boolean;
}

const paymentDB = async (tokenUser: any, body: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser?.id,
    },
  });

  // console.log(body);
  const initialShopId = body?.[0]?.shopId;
  const shopId = body?.find((item: any) => {
    if (initialShopId !== item?.shopId) {
      throw new AppError(StatusCodes.ACCEPTED, "ShopId not match");
    }
  });

  const usedPromoProductIds = body
    ?.filter((item: any) => item?.isPromoUse === true) // Filter items where isPromoUse is true
    ?.map((item: any) => item.id); // Map to extract the id of each filtered item

  // db থেকে প্রোডাক্ট বের করছি
  const findWithPromoProducts = await prisma.product.findMany({
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
  const usedPromoProductIdAndBuyQuantity = body
    ?.filter((item: any) => item?.isPromoUse === true) // Filter items where isPromoUse is true
    ?.map((item: any) => ({
      id: item?.id,
      buyQuantity: item?.buyQuantity,
    })); // Map to extract the id of each filtered item
  // console.log({ usedPromoProductIdAndBuyQuantity });

  const withPromoProductCalculationResult = usedPromoProductIdAndBuyQuantity
    .map((promoItem: any) => {
      const product = findWithPromoProducts.find(
        (item) => item.id === promoItem.id
      );

      if (product) {
        const totalBuyQuantity = Math.min(
          promoItem.buyQuantity,
          product.quantity
        ); // বড় হলে, স্টকের সীমায় রাখুন

        const totalPrice =
          totalBuyQuantity * (product.price - (product.flashSaleDiscount || 0)); // price + flashSaleDiscount

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
  const normalProductIds = body
    ?.filter((item: any) => item?.isPromoUse !== true) // Filter items where isPromoUse is true
    ?.map((item: any) => item.id); // Map to extract the id of each filtered item

  const findWithOutPromoProducts = await prisma.product.findMany({
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
  const normalBuyQuantity = body
    ?.filter((item: any) => item?.isPromoUse !== true) // Filter items where isPromoUse is true
    ?.map((item: any) => ({
      id: item?.id,
      buyQuantity: item?.buyQuantity,
    })); // Map to extract the id of each filtered item

  const normalProductCalculationResult = normalBuyQuantity
    .map((promoItem: any) => {
      const product = findWithOutPromoProducts.find(
        (item) => item.id === promoItem.id
      );

      if (product) {
        const totalBuyQuantity = Math.min(
          promoItem.buyQuantity,
          product.quantity
        ); // বড় হলে, স্টকের সীমায় রাখুন

        const totalPrice =
          totalBuyQuantity * (product.price - (product.discount || 0)); // price + flashSaleDiscount

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

  const normalTotalPrice =
    normalProductCalculationResult?.reduce(
      (acc: any, item: any) => acc + item?.totalPrice,
      0
    ) || 0;
  const promoTotalPrice =
    withPromoProductCalculationResult?.reduce(
      (acc: any, item: any) => acc + item?.totalPrice,
      0
    ) || 0;
  const mainTotalPrice = normalTotalPrice + promoTotalPrice;

  // const initialDataCreate = await prisma.$transaction(async (tx) => {
  //   const createPayment = await tx.payment.create({
  //     data: {},
  //   });
  // });
  return mainTotalPrice;
  console.log({ mainTotalPrice });

  const transactionId = uuidv7(); // Generate a UUID
  const currentTime = new Date().toISOString(); // or use Date.now() for a timestamp in milliseconds

  // Concatenate UUID with current time
  const combinedTransactionId = `${transactionId}-${currentTime}`;
  const formData = {
    cus_name: `${user?.name ? user?.name : "N/A"}`,
    cus_email: `${user?.email ? user?.email : "N/A"}`,
    cus_phone: `${"N/A"}`,
    amount: body?.amount,
    tran_id: combinedTransactionId,
    signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
    store_id: "aamarpaytest",
    currency: "BDT",
    desc: combinedTransactionId,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    success_url: `${process.env.BASE_URL}/api/payment/callback?txnId=${combinedTransactionId}&userId=${user?.id}`,

    fail_url: `${process.env.BASE_URL}/api/payment/callback`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`, // its redirect to frontend directly
    type: "json", //This is must required for JSON request
  };

  const { data } = await axios.post(
    `${process.env.AAMAR_PAY_HIT_API}`,
    formData
  );

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
};

const callbackDB = async (body: any, query: any) => {
  // const session = await startSession();
  // session.startTransaction();
  // try {
  //   if (body && body?.status_code === "2") {
  //     const verifyPaymentData = await verifyPayment(query?.txnId);
  //     if (verifyPaymentData && verifyPaymentData?.status_code === "2") {
  //       // Destructuring the necessary data
  //       const { approval_code, payment_type, amount, cus_phone, mer_txnid } =
  //         verifyPaymentData;
  //       // Prepare the payment data
  //       const paymentData = {
  //         userId: query?.userId,
  //         mer_txnid,
  //         cus_phone,
  //         amount,
  //         payment_type,
  //         approval_code,
  //       };
  //       // Update user isVerified field
  //       const result = await UserModel.findByIdAndUpdate(
  //         { _id: query?.userId },
  //         { isVerified: true },
  //         { new: true, session } // Pass the session for transaction
  //       ).select("_id");
  //       if (!result?.id) {
  //         throw new AppError(StatusCodes.PRECONDITION_FAILED, "Payment failed");
  //       }
  //       //! Save the payment info
  //       const savePaymentInfo = await PaymentInfoModel.create([paymentData], {
  //         session,
  //       });
  //       if (!savePaymentInfo) {
  //         throw new AppError(
  //           httpStatus.PRECONDITION_FAILED,
  //           "Payment info create failed"
  //         );
  //       }
  //       // Commit the transaction
  //       await session.commitTransaction();
  //       session.endSession();
  //       return {
  //         success: true,
  //         txnId: query?.txnId,
  //       };
  //     }
  //   }
  //   if (body && body?.status_code === "7") {
  //     return {
  //       success: false,
  //     };
  //   }
  //   // If something doesn't match, abort the transaction
  //   await session.abortTransaction();
  //   session.endSession();
  // } catch (error) {
  //   // Abort the transaction on any error
  //   await session.abortTransaction();
  //   session.endSession();
  //   throw new AppError(StatusCodes.PRECONDITION_FAILED, "Payment Failed"); // Rethrow the error to handle it outside the function
  // }
};

const myAllPaymentInfoDB = async (
  userId: string,
  queryObj: Partial<TPaymentInfo>
) => {
  // const user = await UserModel.findById({ _id: userId }).select("+password");
  // if (!user) {
  //   throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  // }
  // if (user?.isDelete) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  // }
  // if (user?.status === USER_STATUS.block) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  // }
  // const queryPaymentInfo = new QueryBuilder2(
  //   PaymentInfoModel.find({ userId }).populate({
  //     path: "userId",
  //     select: "name _id email",
  //   }),
  //   queryObj
  // )
  //   .filter()
  //   .fields()
  //   .sort()
  //   .paginate()
  //   .search(paymentInfoSearchTerm);
  // const result = await queryPaymentInfo.modelQuery;
  // const meta = await queryPaymentInfo.countTotal();
  // return {
  //   result,
  //   meta,
  // };
};
const allPaymentInfoDB = async (
  userId: string,
  queryObj: Partial<TPaymentInfo>
) => {
  // const user = await UserModel.findById({ _id: userId }).select("+password");
  // if (!user) {
  //   throw new AppError(httpStatus.NOT_FOUND, "User Not found !");
  // }
  // if (user?.isDelete) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Delete !");
  // }
  // if (user?.status === USER_STATUS.block) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Blocked!");
  // }
  // if (user?.role !== USER_ROLE.admin) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "You are not admin !!");
  // }
  // const queryPaymentInfo = new QueryBuilder2(
  //   PaymentInfoModel.find().populate({
  //     path: "userId",
  //     select: "name _id email profilePhoto",
  //   }),
  //   queryObj
  // )
  //   .filter()
  //   .fields()
  //   .sort()
  //   .paginate()
  //   .search(paymentInfoSearchTerm);
  // const result = await queryPaymentInfo.modelQuery;
  // const meta = await queryPaymentInfo.countTotal();
  // return {
  //   result,
  //   meta,
  // };
};

export const paymentService = {
  paymentDB,
  callbackDB,
  myAllPaymentInfoDB,
  allPaymentInfoDB,
};
