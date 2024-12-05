import { Prisma, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { shopAllProductsSearchAbleFields } from "./Product.const";

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
  if (IsVendor) {
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
    console.log(searchTerm);

    andCondition.push({
      OR: shopAllProductsSearchAbleFields?.map((field) => ({
        [field]: {
          contains: queryObj.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // return andCondition
  console.log(andCondition);

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

export const productService = {
  createProductDB,
  updateProductDB,
  findVendorShopAllProductsDB,
};
