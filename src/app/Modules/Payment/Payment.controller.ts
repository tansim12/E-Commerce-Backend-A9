import { RequestHandler } from "express";
import { paymentService } from "./Payment.service";

import dotenv from "dotenv";
import { successResponse } from "../../Re-useable/successResponse";
import { paymentInfoFilterAbleFields } from "./Payment.const";
import pick from "../../shared/pick";
import { StatusCodes } from "http-status-codes";
dotenv.config();

const payment: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.paymentDB(req.user, req.body);
    res.send(successResponse(result, 200, "Payment ongoing ..."));
  } catch (error) {
    next(error);
  }
};
const callback: RequestHandler = async (req, res, next) => {
  try {
    const result: any = await paymentService.callbackDB(req.body, req?.query);
    if (result?.success) {
      res.redirect(
        // `${process.env.FRONTEND_URL}payment-success?bookingId=${result?.bookingId}`
        //! todo should be dynamic transaction id
        `${process.env.FRONTEND_URL}/payment-success?bookingId=${result?.txnId}`
      );
    }
    if (result?.success === false) {
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  } catch (error) {
    next(error);
  }
};

const myAllPaymentInfo: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, paymentInfoFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await paymentService.myAllPaymentInfoDB(
      req?.user,
      filters,
      options
    );
    res.send(successResponse(result, StatusCodes.OK, "find all user"));
  } catch (error) {
    next(error);
  }
};
const allPaymentInfo: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, paymentInfoFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await paymentService.allPaymentInfoDB(filters, options);
    res.send(successResponse(result, StatusCodes.OK, "find all user"));
  } catch (error) {
    next(error);
  }
};
const adminAndVendorUpdatePayment: RequestHandler = async (req, res, next) => {
  try {
    const result = await paymentService.adminAndVendorUpdatePaymentDB(
      req?.params?.paymentId,
      req?.body
    );
    res.send(successResponse(result, StatusCodes.OK, "update payment"));
  } catch (error) {
    next(error);
  }
};

export const paymentController = {
  payment,
  callback,
  myAllPaymentInfo,
  allPaymentInfo,
  adminAndVendorUpdatePayment,
};
