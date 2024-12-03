import { RequestHandler } from "express";
import { categoryAndSubCategoryService } from "./CategoryAndSubCategory.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const result = await categoryAndSubCategoryService.createCategoryDB(
      req?.user,
      req?.body
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Category Create successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const result = await categoryAndSubCategoryService.updateCategoryDB(
      req?.params?.categoryId,
      req?.body
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Category update successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
const createSubCategory: RequestHandler = async (req, res, next) => {
  try {
    const result = await categoryAndSubCategoryService.createSubCategoryDB(
      req?.user,
      req?.body
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Sub Category Create successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateSubCategory: RequestHandler = async (req, res, next) => {
  try {
    const result = await categoryAndSubCategoryService.updateSubCategoryDB(
      req?.params?.subCategoryId,
      req?.body
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Sub Category update successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const categoryAndSubCategoryController = {
  createCategory,
  createSubCategory,
  updateCategory,
  updateSubCategory,
};
