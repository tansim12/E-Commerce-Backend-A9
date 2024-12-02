import { RequestHandler } from "express";
import { userService } from "./User.service";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { userFilterAbleFields } from "./User.const";
import { StatusCodes } from "http-status-codes";

const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await userService.getAllUsersDB(filters, options);
    res.send(successResponse(result, StatusCodes.OK, "find all user"));
  } catch (error) {
    next(error);
  }
};

//! access image
// if (req?.file?.path) {
//   adminData = { ...adminData, profilePhoto: req.file.path };
// }

//!todo  পরে update এর কাজ করবো
// const adminUpdateUser: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await userService.adminUpdateUserDB(
//       req?.user.id,
//       req?.params?.userId,
//       req.body
//     );
//     res.send(
//       successResponse(
//         result,
//         StatusCodes.OK,
//         "User Info update successfully done"
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };
const findMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.findMyProfileDB(
      req?.user.id,
      req?.user.role
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "User profile data get successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
const updateMyProfile: RequestHandler = async (req, res, next) => {
  let userData = req.body;
  if (req?.file?.path) {
    userData = { ...userData, profilePhoto: req.file.path };
  }
  try {
    const result = await userService.updateMyProfileDB(
      req?.user.id,
      req?.user.role,
      userData
    );
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "User profile data get successfully done"
      )
    );
  } catch (error) {
    next(error);
  }
};
export const userController = {
  getAllUsers,
  // adminUpdateUser,
  findMyProfile,
  updateMyProfile,
};
