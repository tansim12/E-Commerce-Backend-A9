import { StatusCodes } from "http-status-codes";
import AppError from "../../Error-Handler/AppError";
import prisma from "../../shared/prisma";
import { TCategory } from "./CategoryAndSubCategory.interface";
import { formatCategoryName } from "../../utils/formatCategoryName";
import { IPaginationOptions } from "../../interface/pagination";
import { Prisma } from "@prisma/client";
import { categorySearchAbleFields } from "./CategoryAndSubCategory.const";
import { paginationHelper } from "../../helper/paginationHelper";

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
      NOT: {
        id: categoryId,
      },
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
      NOT: {
        id: subCategoryId,
      },
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

const findAllCategoryDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: categorySearchAbleFields.map((field) => ({
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

  const result = await prisma.category.findMany({
    where: whereConditions as any,
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          status: true,
          isDelete: true,
        },
      },
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

  const total = await prisma.category.count({
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
const findAllSubCategoryDB = async (
  queryObj: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: categorySearchAbleFields.map((field) => ({
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

  const result = await prisma.subCategory.findMany({
    where: whereConditions as any,
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          status: true,
          isDelete: true,
        },
      },
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

  const total = await prisma.subCategory.count({
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

export const categoryAndSubCategoryService = {
  createCategoryDB,
  createSubCategoryDB,
  updateCategoryDB,
  updateSubCategoryDB,
  findAllCategoryDB,
  findAllSubCategoryDB,
};
