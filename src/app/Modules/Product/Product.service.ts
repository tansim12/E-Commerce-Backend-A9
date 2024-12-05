import { UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

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

export const productService = {
  createProductDB,
  updateProductDB,
};
