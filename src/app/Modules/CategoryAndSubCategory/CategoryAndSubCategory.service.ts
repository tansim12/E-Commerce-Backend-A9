import { StatusCodes } from "http-status-codes";
import AppError from "../../Error-Handler/AppError";
import prisma from "../../shared/prisma";
import { TCategory } from "./CategoryAndSubCategory.interface";
import { formatCategoryName } from "../../utils/formatCategoryName";

const createCategoryDB = async (tokenUser: any, payload: TCategory) => {
  const { categoryName, ...newPayload } = payload;
  const categoryNameFormate = formatCategoryName(categoryName);
  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });
  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }

  const isExistSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });
  if (isExistSubCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This SubCategory already exist"
    );
  }

  const result = await prisma.category.create({
    data: {
      ...newPayload,
      categoryName: categoryNameFormate,
      adminId: tokenUser?.id,
    },
  });
  return result;
};
const updateCategoryDB = async (categoryId: any, payload: TCategory) => {
  const { categoryName, ...newPayload } = payload;
  
  const categoryNameFormate = formatCategoryName(categoryName);
  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: categoryNameFormate,
      NOT:{
        id:categoryId
      }
    },
  });
  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }

  const isExistSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });
  if (isExistSubCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This SubCategory already exist"
    );
  }

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...newPayload,
      categoryName: categoryNameFormate,
    },
  });
  return result;
};
const createSubCategoryDB = async (tokenUser: any, payload: TCategory) => {
  const { categoryName } = payload;
  const categoryNameFormate = formatCategoryName(categoryName);

  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });

  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }

  const isExistSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });
  if (isExistSubCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This SubCategory already exist"
    );
  }
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

  const result = await prisma.subCategory.create({
    data: {
      categoryId: payload.categoryId as string,
      categoryName: categoryNameFormate,
      adminId: tokenUser?.id,
    },
  });
  return result;
};
const updateSubCategoryDB = async (
  subCategoryId: string,
  payload: TCategory
) => {
  const { categoryName, ...others } = payload;
  const categoryNameFormate = formatCategoryName(categoryName);

  const isExistCategory = await prisma.category.findFirst({
    where: {
      categoryName: categoryNameFormate,
    },
  });

  if (isExistCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This Category already exist"
    );
  }

  const isExistSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryName: categoryNameFormate,
      NOT:{
        id:subCategoryId
      }
    },
  });
  if (isExistSubCategory) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      "This SubCategory already exist"
    );
  }

  const result = await prisma.subCategory.update({
    where: {
      id: subCategoryId,
    },
    data: {
      categoryName: categoryNameFormate,
      ...others,
    },
  });
  return result;
};

export const categoryAndSubCategoryService = {
  createCategoryDB,
  createSubCategoryDB,
  updateCategoryDB,
  updateSubCategoryDB,
};
