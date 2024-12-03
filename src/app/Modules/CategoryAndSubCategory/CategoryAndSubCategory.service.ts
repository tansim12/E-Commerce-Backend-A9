import { StatusCodes } from "http-status-codes";
import AppError from "../../Error-Handler/AppError";
import prisma from "../../shared/prisma";
import { TCategory } from "./CategoryAndSubCategory.interface";
import { formatCategoryName } from "../../utils/formatCategoryName";

const createCategoryDB = async (tokenUser: any, payload: TCategory) => {
  const { categoryName, ...newPayload } = payload;
  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: {
        contains: payload?.categoryName,
        mode: "insensitive",
      },
    },
  });
  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }
  const categoryNameFormate = formatCategoryName(categoryName);

  const result = await prisma.category.create({
    data: {
      ...newPayload,
      categoryName: categoryNameFormate,
      adminId: tokenUser?.id,
    },
  });
  return result;
};

export const categoryAndSubCategoryService = {
  createCategoryDB,
};
