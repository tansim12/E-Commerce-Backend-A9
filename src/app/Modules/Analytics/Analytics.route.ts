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
router.get(
  "/shop",
  authMiddleWare(UserRole.vendor),
  analyticsController.shopAnalytics
);
router.post("/newsletter", analyticsController.createNewsletter);
router.get(
  "/newsletter",
  authMiddleWare(UserRole.admin),
  analyticsController.findAllNewsLetterEmail
);

export const analyticsRoutes = router;
