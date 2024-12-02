import { Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { shopSearchAbleFields } from "./Shop.const";

const crateShopDB = async (tokenUser: any, payload: any) => {
  console.log(tokenUser);

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
    data: {
      vendorId: payload?.vendorId,
      name: payload.name,
    },
  });
  return result;
};

// todo
const findSingleShopPublicDB = async (shopId: string) => {
  // todo include added product,followers etc
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
    },
  });
  return result;
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

export const shopService = {
  crateShopDB,
  findAllShopPublicDB,
  findSingleShopPublicDB,
  shopFollowingDB,
  shopReviewDB,
};
