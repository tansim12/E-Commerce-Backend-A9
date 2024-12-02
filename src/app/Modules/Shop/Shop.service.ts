import { Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";

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
          role: UserRole.admin,
        },
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

export const shopService = {
  crateShopDB,
};
