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
  "/user/shop-following",
  validationMiddleWare(shopFollowSchema.createShopFollowSchema),
  authMiddleWare(UserRole.admin, UserRole.user, UserRole.vendor),
  shopController.shopFollowing
);
router.put(
  "/user/shop-review",
  validationMiddleWare(shopFollowSchema.createShopReviewSchema),
  authMiddleWare(UserRole.admin, UserRole.user, UserRole.vendor),
  shopController.shopReview
);


router.get(
  "/vendor/vendor-my-shop",
  authMiddleWare(UserRole.admin, UserRole.vendor),
  shopController.vendorFindHisShop
);

export const shopRouter = router;
