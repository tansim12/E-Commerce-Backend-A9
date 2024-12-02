import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
const prisma = new PrismaClient();
import Bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { userSearchAbleFields } from "./User.const";

import { StatusCodes } from "http-status-codes";

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
  console.log(searchTerm);

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
      needPasswordChange: true,
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





const adminUpdateUserDB = async (
  tokenId: string,
  userId: string,
  payload: any
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenId,
      isDelete: false,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    select: {
      id: true,
    },
  });

  return result;
};

const findMyProfileDB = async (tokenId: string, role: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: tokenId, isDelete: false, status: UserStatus.ACTIVE },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      status: true,
      isDelete: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  let userProfile = {};

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    userProfile = await prisma.admin.findUniqueOrThrow({
      where: { email: user.email },
    });
  }

  if (role === UserRole.PATIENT) {
    userProfile = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
  }
  if (role === UserRole.DOCTOR) {
    userProfile = await prisma.doctor.findUniqueOrThrow({
      where: { email: user.email },
    });
  }

  return { ...userProfile, ...user };
};
const updateMyProfileDB = async (tokenId: string, role: string, body: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: tokenId, isDelete: false, status: UserStatus.ACTIVE },
  });

  if (body.status || body.role) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You can't change role and status"
    );
  }

  let userProfile = {};

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    userProfile = await prisma.admin.update({
      where: { email: user.email },
      data: body,
    });
  }

  if (role === UserRole.PATIENT) {
    userProfile = await prisma.patient.update({
      where: { email: user.email },
      data: body,
    });
  }
  if (role === UserRole.DOCTOR) {
    userProfile = await prisma.doctor.update({
      where: { email: user.email },
      data: body,
    });
  }

  return userProfile;
};
export const userService = {
  getAllUsersDB,
  createUserDB,
  adminCreateDB,
  createDoctorDB,
  createPatientDB,
  adminUpdateUserDB,
  findMyProfileDB,
  updateMyProfileDB,
};
