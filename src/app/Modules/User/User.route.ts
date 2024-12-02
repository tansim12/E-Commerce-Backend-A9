import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";

import { multerUpload } from "../../config/multer.config";
import validationMiddleWare from "../../middleware/validationMiddleWare";
// import { adminZodValidation } from "../Admin/Admin.ZodValidation";
import { userZodValidation } from "./User.ZodValidation";
import { jsonDataSetMiddleware } from "../../middleware/jsonDataSetMiddleware";
import { authMiddleWare } from "../../middleware/authMiddleware";
const router = express.Router();

//! upload file
// multerUpload.single("image"),
//   jsonDataSetMiddleware,

router.get("/", authMiddleWare(UserRole.admin), userController.getAllUsers);

// router.put(
//   "/update-info/:userId",
//   authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   validationMiddleWare(userZodValidation.updateUserZodSchema),
//   userController.adminUpdateUser
// );
router.get(
  "/my-profile",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  userController.findMyProfile
);
router.put(
  "/update-my-profile",
  multerUpload.single("image"),
  jsonDataSetMiddleware,
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  userController.updateMyProfile
);

export const userRouter = router;
