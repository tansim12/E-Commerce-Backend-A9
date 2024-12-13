import { PaymentStatus, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import { format } from "date-fns";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";
const adminAnalyticsDB = async () => {
  // Aggregate revenue grouped by months
  const monthlyRevenue = await prisma.payment.groupBy({
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
  const revenueByMonth: { month: string; revenue: number }[] = Array(12)
    .fill(0)
    .map((_, i) => ({
      month: format(new Date(new Date().getFullYear(), i, 1), "MMMM"), // Full month name
      revenue: 0,
    }));

  // Populate revenue in the correct month
  for (const record of monthlyRevenue) {
    const monthIndex = new Date(record.createdAt).getMonth();
    revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
  }

  //! payment status base info
  // Count payments grouped by status
  const statusCounts = await prisma.payment.groupBy({
    by: ["paymentStatus"],
    _count: {
      paymentStatus: true,
    },
  });

  // Format the result
  const paymentStatusBaseInfo = statusCounts.reduce(
    (acc, record) => {
      acc[record.paymentStatus] = record._count.paymentStatus;
      return acc;
    },
    { confirm: 0, pending: 0, cancel: 0 }
  );

  //! use status base info
  const totalUsers = await prisma.user.count();

  // Active and blocked user count
  const userStatusCounts = await prisma.user.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Format the result
  const formattedCounts = userStatusCounts.reduce(
    (acc, record) => {
      acc[record.status] = record._count.status;
      return acc;
    },
    { active: 0, blocked: 0 }
  );

  // ! shop isDelete base data

  // Total shop count
  const totalShops = await prisma.shop.count();

  // Active and deactive shop count
  const shopStatusCounts = await prisma.shop.groupBy({
    by: ["isDelete"],
    _count: {
      isDelete: true,
    },
  });

  // Format the result
  const formattedCountShop = shopStatusCounts.reduce(
    (acc, record) => {
      if (record.isDelete) {
        acc.deactive = record._count.isDelete;
      } else {
        acc.active = record._count.isDelete;
      }
      return acc;
    },
    { active: 0, deactive: 0 }
  );

  return {
    revenueByMonth,
    paymentStatusBaseInfo,
    userInfo: {
      totalUsers,
      ...formattedCounts,
    },
    shopInfo: {
      totalShops,
      ...formattedCountShop,
    },
  };
};

//! shop analytics
const shopAnalyticsDB = async (tokenUser: any) => {
  const findShop = await prisma.user?.findUnique({
    where: {
      id: tokenUser?.id,
      isDelete: false,
      role: UserRole.vendor,
    },
    select: {
      shop: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!findShop?.shop?.id) {
    throw new AppError(StatusCodes.NOT_FOUND, "Shop not found");
  }
  const shopId = findShop?.shop?.id;
  
  // Total revenue
  const totalRevenueData = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      shopId,
      paymentStatus: "confirm",
    },
  });

  //   monthly revenue
  const monthlyRevenue = await prisma.payment.groupBy({
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
  const revenueByMonth: { month: string; revenue: number }[] = Array(12)
    .fill(0)
    .map((_, i) => ({
      month: format(new Date(new Date().getFullYear(), i, 1), "MMMM"), // Full month name
      revenue: 0,
    }));

  // Populate revenue in the correct month
  for (const record of monthlyRevenue) {
    const monthIndex = new Date(record.createdAt).getMonth();
    revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
  }

  //! product data
  // Total active products
  const totalActiveProducts = await prisma.product.count({
    where: {
      shopId,
      isDelete: false,
    },
  });

  // Total inactive products
  const totalInactiveProducts = await prisma.product.count({
    where: {
      shopId,
      isDelete: true,
    },
  });

  // Total products with flash sale active
  const totalFlashSaleProducts = await prisma.product.count({
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
};

export const analyticsService = { adminAnalyticsDB, shopAnalyticsDB };
