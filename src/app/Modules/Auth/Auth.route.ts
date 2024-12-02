import express from "express";
import { AuthController } from "./Auth.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";


const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.loginUser);

router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  AuthController.changePassword
);
router.post(
  "/forget-password",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  AuthController.forgotPassword
);
router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
