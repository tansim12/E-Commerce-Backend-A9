import { Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { shopAllProductsSearchAbleFields } from "./Product.const";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";

const createProductDB = async (tokenUser: any, payload: any) => {
  const vendorInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser?.id,
      isDelete: false,
      shop: {
        vendorId: tokenUser?.id,
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
  const result = await prisma.product.create({
    data: {
      ...payload,
      shopId: vendorInfo?.shop?.id,
    },
  });
  return result;
};
const updateProductDB = async (
  tokenUser: any,
  productId: string,
  payload: any
) => {
  const IsVendor = await prisma.user.findUnique({
    where: {
      id: tokenUser?.id,
      isDelete: false,
      status: UserStatus.active,
    },
  });

  if (IsVendor?.role === UserRole.vendor) {
    await prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
        shop: {
          vendorId: IsVendor?.id,
          isDelete: false,
        },
      },
    });
  }
  const result = await prisma.product.update({
    where: {
      id: productId,
    },
    data: payload,
  });
  return result;
};

const findVendorShopAllProductsDB = async (
  tokenUser: any,
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopAllProductsSearchAbleFields?.map((field) => ({
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
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

  const vendorInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser?.id,
      isDelete: false,
      shop: {
        vendorId: tokenUser?.id,
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
  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      // ...whereConditions,
      id: vendorInfo?.shop?.id,
    },
    include: {
      product: {
        where: {
          ...(whereConditions as any),
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
        },
        skip,
        take: limit,
        orderBy:
          options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
              }
            : {
                createdAt: "desc",
              },
      },
    },
  });
  const total = await prisma.shop.findUniqueOrThrow({
    where: {
      // ...whereConditions,
      id: vendorInfo?.shop?.id,
    },
    include: {
      product: {
        where: {
          ...(whereConditions as any),
        },
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
};

const adminFindAllProductsDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopAllProductsSearchAbleFields.map((field) => ({
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
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

  const result = await prisma.product.findMany({
    where: {
      ...(whereConditions as any),
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
          name: true,
          id: true,
          logo: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.product.count({
    where: whereConditions as any,
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
};
const publicTopSaleProductDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopAllProductsSearchAbleFields.map((field) => ({
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
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

  const result = await prisma.product.findMany({
    where: {
      ...(whereConditions as any),
      isDelete: false,
      isAvailable: true,
      quantity: {
        gt: 1,
      },
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

  const total = await prisma.product.count({
    where: {
      ...(whereConditions as any),
      isDelete: false,
      isAvailable: true,
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
};

const publicSingleProductDb = async (productId: string) => {
  const result = await prisma.product.findUniqueOrThrow({
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

  const relatedProduct = await prisma.product.findMany({
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
};

const publicFlashSaleProductDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopAllProductsSearchAbleFields.map((field) => ({
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
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

  const result = await prisma.product.findMany({
    where: {
      ...(whereConditions as any),
      isDelete: false,
      isAvailable: true,
      // flash sale হওয়ার condition
      isActivePromo: true,
      promo: {
        not: null,
      },
      flashSaleDiscount: {
        not: null,
      },
      flashSaleEndDate: {
        not: null,
      },
      flashSaleStartDate: {
        not: null,
      },
      isFlashSaleOffer: true,
      quantity: {
        gt: 1,
      },
    },

    skip,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const total = await prisma.product.count({
    where: {
      ...(whereConditions as any),
      isDelete: false,
      isAvailable: true,
      // flash sale হওয়ার condition
      isActivePromo: true,
      promo: {
        not: null,
      },
      flashSaleDiscount: {
        not: null,
      },
      flashSaleEndDate: {
        not: null,
      },
      flashSaleStartDate: {
        not: null,
      },
      isFlashSaleOffer: true,
      quantity: {
        gt: 1,
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
};

const publicPromoCheckDB = async (payload: any) => {
  const currentDate = new Date();

  const product = await prisma.product.findFirst({
    where: {
      id: payload?.id,
      isDelete: false,
      shopId: payload?.shopId,
      isAvailable: true,
      // Flash Sale শর্ত
      isActivePromo: true,
      promo: {
        contains: payload?.promo,
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
    newUnitPrice: product?.price - (product?.flashSaleDiscount as number),
    id: product?.id,
  };
};

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

const publicAllProductsDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, priceStart, priceEnd, ...filterData } = queryObj;

  const andCondition = [];

  // Search term condition
  if (searchTerm) {
    andCondition.push({
      OR: shopAllProductsSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter conditions
  if (Object.keys(filterData).length > 0) {
    if (filterData?.isAvailable) {
      filterData.isAvailable =
        typeof filterData.isAvailable === "string"
          ? filterData.isAvailable === "true"
          : filterData.isAvailable;
    }

    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as never],
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

  const whereConditions: Prisma.UserWhereInput = {
    AND: andCondition as any,
    isDelete: false, // Always exclude deleted products
  };

  // Fetch filtered products
  const result = await prisma.product.findMany({
    where: whereConditions as any,
    include: {
      category: true,
      subCategory: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  // Count total filtered products
  const total = await prisma.product.count({
    where: whereConditions as any,
  });

  return {
    meta: { page, limit, total },
    result,
  };
};

const publicCompareProductDB = async (productIds: string[]) => {
  if (productIds?.length > 3) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Longer then 3");
  }
  const result = await prisma.product.findMany({
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
};

export const productService = {
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
};
