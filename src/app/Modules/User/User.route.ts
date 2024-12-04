import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { userZodValidation } from "./User.ZodValidation";
const router = express.Router();

//! upload file
// multerUpload.single("image"),
//   jsonDataSetMiddleware,

router.get("/", authMiddleWare(UserRole.admin), userController.getAllUsers);
router.get("/:userId", userController.getSingleUser);

// router.put(
//   "/update-info/:userId",
//   authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   validationMiddleWare(userZodValidation.updateUserZodSchema),
//   userController.adminUpdateUser
// );
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

export const userRouter = router;
