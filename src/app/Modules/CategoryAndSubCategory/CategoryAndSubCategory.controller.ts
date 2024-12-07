import { RequestHandler } from "express";
import { categoryAndSubCategoryService } from "./CategoryAndSubCategory.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../shared/pick";
import { categoryFilterAbleFields } from "./CategoryAndSubCategory.const";

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

const findAllCategory: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, categoryFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await categoryAndSubCategoryService.findAllCategoryDB(
      filters,
      options
    );
    res.send(successResponse(result, StatusCodes.OK, "All Category"));
  } catch (error) {
    next(error);
  }
};
const findAllSubCategory: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, categoryFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await categoryAndSubCategoryService.findAllSubCategoryDB(
      filters,
      options
    );
    res.send(successResponse(result, StatusCodes.OK, "All Sub Category"));
  } catch (error) {
    next(error);
  }
};
const existFindAllCategory: RequestHandler = async (req, res, next) => {
  try {
    const result = await categoryAndSubCategoryService.existFindAllCategoryDB();
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "All Category just name and id send"
      )
    );
  } catch (error) {
    next(error);
  }
};
const singleCategoryBaseFindAllSubCategory: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await categoryAndSubCategoryService.singleCategoryBaseFindAllSubCategoryDB(
        req?.params?.categoryId
      );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Category base find all sub category just name and id send"
      )
    );
  } catch (error) {
    next(error);
  }
};
const publicFindAllCategoryWithSubCategory: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await categoryAndSubCategoryService.publicFindAllCategoryWithSubCategoryDB();
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Sll Category and sub category find "
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
  findAllCategory,
  findAllSubCategory,
  existFindAllCategory,
  singleCategoryBaseFindAllSubCategory,
  publicFindAllCategoryWithSubCategory,
};
