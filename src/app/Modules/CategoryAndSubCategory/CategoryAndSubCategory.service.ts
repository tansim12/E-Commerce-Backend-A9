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
const createSubCategoryDB = async (tokenUser: any, payload: TCategory) => {
  const { categoryName } = payload;
  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: {
        contains: payload?.categoryName,
        mode: "insensitive",
      },
    },
  });
  const isExistSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryName: {
        contains: payload?.categoryName,
        mode: "insensitive",
      },
    },
  });
  const isDeleteCategory = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
      isDelete: true,
    },
  });
  if (isDeleteCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already Delete"
    );
  }
  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }
  if (isExistSubCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This SubCategory already exist"
    );
  }
  const categoryNameFormate = formatCategoryName(categoryName);

  const result = await prisma.subCategory.create({
    data: {
      categoryId: payload.categoryId as string,
      categoryName: categoryNameFormate,
      adminId: tokenUser?.id,
    },
  });
  return result;
};

export const categoryAndSubCategoryService = {
  createCategoryDB,
  createSubCategoryDB,
};
