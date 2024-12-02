import { RequestHandler } from "express";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";
import { shopService } from "./Shop.service";

const createShop: RequestHandler = async (req, res, next) => {
  try {
    const result = await shopService.crateShopDB(req?.user, req.body);
    res.send(
      successResponse(result, StatusCodes.OK, "Shop create successfully done")
    );
  } catch (error) {
    next(error);
  }
};

export const shopController = {
  createShop,
};
