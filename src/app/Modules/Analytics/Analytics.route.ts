import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { analyticsController } from "./Analytics.controller";

const router = express.Router();

router.get(
  "/admin",
  authMiddleWare(UserRole.admin),
  analyticsController.adminAnalytics
);

export const analyticsRoutes = router;
