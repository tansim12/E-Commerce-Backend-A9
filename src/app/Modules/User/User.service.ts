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

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      email: true,
      createdAt: true,
      id: true,
      status: true,
      isDelete: true,
      role: true,
      updatedAt: true,
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

// const adminUpdateUserDB = async (
//   tokenId: string,
//   userId: string,
//   payload: any
// ) => {
//   await prisma.user.findUniqueOrThrow({
//     where: {
//       id: tokenId,
//       isDelete: false,
//       status: UserStatus.active,
//     },
//   });

//   const result = await prisma.user.update({
//     where: {
//       id: userId,
//     },
//     data: payload,
//     select: {
//       id: true,
//     },
//   });

//   return result;
// };

const findMyProfileDB = async (tokenId: string, role: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: tokenId, isDelete: false, status: UserStatus.active },
    select: {
      id: true,
      email: true,
      status: true,
      isDelete: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
const updateMyProfileDB = async (tokenId: string, role: string, body: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: tokenId, isDelete: false, status: UserStatus.active },
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
export const userService = {
  getAllUsersDB,
  // adminUpdateUserDB,
  findMyProfileDB,
  updateMyProfileDB,
};
