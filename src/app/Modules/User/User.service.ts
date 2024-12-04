import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
const prisma = new PrismaClient();
import Bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { userSearchAbleFields } from "./User.const";

import { StatusCodes } from "http-status-codes";
import AppError from "../../Error-Handler/AppError";

const getAllUsersDB = async (queryObj: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map((field) => ({
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

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      email: true,
      name: true,
      createdAt: true,
      id: true,
      status: true,
      isDelete: true,
      role: true,
      updatedAt: true,
      userProfile: true,
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

  const total = await prisma.user.count({
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
};

const adminUpdateUserDB = async (userId: string, payload: any) => {
  if (payload?.email|| payload.password) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "You Can't change email or password");
  }
  const result = await prisma.$transaction(async (tx) => {
    const userInfo = await tx.user.update({
      where: {
        id: userId,
      },
      data: payload,
      select: {
        id: true,
        name: true,
        email: true,
        isDelete: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
    await tx.userProfile.update({
      where: {
        email: userInfo.email,
      },
      data: {
        status: payload?.status,
      },
    });
    return userInfo;
  });

  return result;
};

const findMyProfileDB = async (tokenUser: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: tokenUser?.email,
      isDelete: false,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      status: true,
      isDelete: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });

  return user;
};
const updateMyProfileDB = async (tokenUser: any, body: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: tokenUser.email,
      isDelete: false,
      status: UserStatus.active,
    },
  });

  if (body.status || body.role) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can't change role and status"
    );
  }

  let userProfile = await prisma.userProfile.update({
    where: { email: user.email },
    data: body,
  });

  return userProfile;
};
const getSingleUserDB = async (paramsId: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: paramsId,
      isDelete: false,
      status: UserStatus.active,
    },
    select: {
      email: true,
      id: true,
      role: true,
      name: true,
      isDelete: true,
      createdAt: true,
      lastPasswordChange: true,
      status: true,
      updatedAt: true,
      userProfile: true,
    },
  });
  return result;
};
export const userService = {
  getAllUsersDB,
  adminUpdateUserDB,
  findMyProfileDB,
  updateMyProfileDB,
  getSingleUserDB,
};
