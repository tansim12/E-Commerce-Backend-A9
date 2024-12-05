import { RequestHandler } from "express";
import { productService } from "./Product.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const result = await productService.createProductDB(
      req?.user,

      req?.body
    );
    res.send(successResponse(result, StatusCodes.OK, "Product Created"));
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
};
