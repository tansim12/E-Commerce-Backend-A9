import express from "express";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { shopController } from "./Shop.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { shopFollowSchema } from "./Shop.zodValidation";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.admin, UserRole.vendor),
  shopController.createShop
);
router.get("/", shopController.findAllShopPublic);
router.get("/:shopId", shopController.findSingleShopPublic);
router.post(
  "/user/following",
  validationMiddleWare(shopFollowSchema.createShopFollowSchema),
  authMiddleWare(UserRole.admin, UserRole.user, UserRole.vendor),
  shopController.shopFollowing
);

export const shopRouter = router;
