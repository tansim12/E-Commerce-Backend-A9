import express from "express";
import { AuthController } from "./Auth.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { authSchemas } from "./Auth.zodValidation";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleWare(authSchemas.signupSchema),
  AuthController.signUp
);
router.post(
  "/login",
  validationMiddleWare(authSchemas.loginSchema),
  AuthController.loginUser
);

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
