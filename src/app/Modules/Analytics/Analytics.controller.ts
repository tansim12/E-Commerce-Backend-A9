import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { analyticsService } from "./Analytics.service";
import { successResponse } from "../../Re-useable/successResponse";

const adminAnalytics: RequestHandler = async (req, res, next) => {
  try {
    const result = await analyticsService.adminAnalyticsDB();
    res.send(successResponse(result, StatusCodes.OK, "Find admin analytics"));
  } catch (error) {
    next(error);
  }
};
const shopAnalytics: RequestHandler = async (req, res, next) => {
  try {
    const result = await analyticsService.shopAnalyticsDB(req?.user);
    res.send(successResponse(result, StatusCodes.OK, "shop analytics"));
  } catch (error) {
    next(error);
  }
};

export const analyticsController = {
  adminAnalytics,
  shopAnalytics,
};
