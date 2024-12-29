import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { userZodValidation } from "./User.ZodValidation";
const router = express.Router();

//! upload file

router.get("/", authMiddleWare(UserRole.admin), userController.getAllUsers);
router.get("/:userId", userController.getSingleUser);

router.get(
  "/find/my-profile",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  userController.findMyProfile
);
router.put(
  "/update-my-profile",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  userController.updateMyProfile
);
router.put(
  "/admin-update-user/:userId",
  validationMiddleWare(userZodValidation.updateUserZodSchema),
  authMiddleWare(UserRole.admin),
  userController.adminUpdateUser
);
router.post(
  "/wishList",
  authMiddleWare(UserRole.admin, UserRole.vendor, UserRole.user),
  userController.createWishlist
);
router.get(
  "/wishList/all",
  authMiddleWare(UserRole.admin, UserRole.vendor, UserRole.user),
  userController.findUserAllWishList
);

export const userRouter = router;
