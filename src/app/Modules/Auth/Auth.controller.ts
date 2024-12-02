import { Request, RequestHandler, Response } from "express";

import { AuthServices } from "./Auth.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../config";

const signUp: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.singUpDB(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: config.env === "production",
      httpOnly: true,
    });
    res.send(
      successResponse(
        {
          accessToken: result.accessToken,
        },
        StatusCodes.OK,
        "Signup successfully!"
      )
    );
  } catch (error) {
    next(error);
  }
};
const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: config.env === "production",
      httpOnly: true,
    });
    res.send(
      successResponse(
        {
          accessToken: result.accessToken,
        },
        StatusCodes.OK,
        "Logged in successfully!"
      )
    );
  } catch (error) {
    next(error);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    res.send(successResponse(result, StatusCodes.OK, "refresh token send"));
  } catch (error) {
    next(error);
  }
};
const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.changePasswordDB(req.user, req.body);
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Password Change Successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.forgotPasswordDB(req.body);
    res.send(
      successResponse(result, StatusCodes.OK, "Email link sending done ")
    );
  } catch (error) {
    next(error);
  }
};
const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization || "";

    const result = await AuthServices.resetPasswordDB(token, req?.body);
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Password Change Successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  signUp,
  loginUser,
  refreshToken,
  forgotPassword,
  changePassword,
  resetPassword,
};
