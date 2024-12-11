import { Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { shopSearchAbleFields } from "./Shop.const";

const crateShopDB = async (tokenUser: any, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser.id,
      isDelete: false,
      OR: [
        {
          role: UserRole.admin,
        },
        {
          role: UserRole.vendor,
        },
      ],
    },
  });
  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.vendorId,
      isDelete: false,
      OR: [
        {
          role: UserRole.vendor,
        },
      ],
    },
  });

  const result = await prisma.shop.create({
    data: payload,
  });
  return result;
};

const findSingleShopPublicDB = async (
  shopId: string,
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.shop.findUniqueOrThrow({
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

  const total = await prisma.shop.count({
    where: {
      id: shopId,
      isDelete: false,
    },
  });
  const meta = {
    page,
    limit,
    total: result?._count?.product,
  };
  return {
    meta,
    result,
  };
};

// public all shop get
const findAllShopPublicDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;
  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopSearchAbleFields.map((field) => ({
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

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.shop.findMany({
    where: {
      ...(whereConditions as any),
      isDelete: false,
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

  const total = await prisma.shop.count({
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

// following and review section
const shopFollowingDB = async (tokenUser: any, payload: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser.id,
      isDelete: false,
      status: UserStatus.active,
    },
  });

  if (payload?.isDelete === false) {
    const result = await prisma.shopFollow.upsert({
      where: {
        userId_shopId: {
          shopId: payload?.shopId,
          userId: userInfo?.id,
        },
      },
      update: {
        ...payload,
        userId: userInfo?.id,
      },
      create: {
        ...payload,
        userId: userInfo?.id,
      },
    });
    return result;
  }
  if (payload?.isDelete === true) {
    const result = await prisma.shopFollow.delete({
      where: {
        userId_shopId: {
          shopId: payload?.shopId,
          userId: userInfo?.id,
        },
      },
    });
    return result;
  }
};
const shopReviewDB = async (tokenUser: any, payload: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUser.id,
      isDelete: false,
      status: UserStatus.active,
    },
  });

  if (payload?.isDelete === false) {
    const result = await prisma.shopReview.upsert({
      where: {
        userId_shopId: {
          shopId: payload?.shopId,
          userId: userInfo?.id,
        },
      },
      update: {
        ...payload,
        userId: userInfo?.id,
      },
      create: {
        ...payload,
        userId: userInfo?.id,
      },
    });
    return result;
  }
  if (payload?.isDelete === true) {
    const result = await prisma.shopReview.delete({
      where: {
        userId_shopId: {
          shopId: payload?.shopId,
          userId: userInfo?.id,
        },
      },
    });
    return result;
  }
};

const vendorFindHisShopDB = async (tokenUser: any) => {
  const result = await prisma.shop.findUnique({
    where: {
      vendorId: tokenUser?.id,
    },
  });
  return result;
};

const updateShopInfoDB = async (
  tokenUser: any,
  shopId: string,
  payload: any
) => {
  const isVendor = await prisma.user.findUnique({
    where: {
      id: tokenUser.id,
      role: UserRole.vendor,
    },
  });

  if (isVendor) {
    await prisma.shop.findUniqueOrThrow({
      where: {
        id: shopId,
        vendorId: isVendor?.id,
      },
    });
  }
  const { vendorId, id, ...newPayload } = payload;
  const result = await prisma.shop.update({
    where: {
      id: shopId,
    },
    data: newPayload,
  });
  return result;
};

// public all shop get
const adminFindAllShopDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;
  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: shopSearchAbleFields.map((field) => ({
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

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.shop.findMany({
    where: {
      ...(whereConditions as any),
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

  const total = await prisma.shop.count({
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

const findSingleUserFollowDB = async (tokenUser: any) => {
  const result = await prisma.shopFollow.findFirst({
    where: {
      userId: tokenUser?.id,
    },
  });
  if (!result) {
    return {
      status: 201,
      message: "No Table create",
    };
  }
  return result;
};

export const shopService = {
  crateShopDB,
  findAllShopPublicDB,
  findSingleShopPublicDB,
  shopFollowingDB,
  shopReviewDB,
  vendorFindHisShopDB,
  updateShopInfoDB,
  adminFindAllShopDB,
  findSingleUserFollowDB,
};
