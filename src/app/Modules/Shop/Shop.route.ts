import express from "express";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { shopController } from "./Shop.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { shopFollowSchema } from "./Shop.zodValidation";
const router = express.Router();

router.post(
  "/",
  validationMiddleWare(shopFollowSchema.shopCreateSchema),
  authMiddleWare(UserRole.admin, UserRole.vendor),
  shopController.createShop
);

router.put(
  "/:shopId",
  validationMiddleWare(shopFollowSchema.shopUpdateSchema),
  authMiddleWare(UserRole.admin, UserRole.vendor),
  shopController.updateShopInfo
);

router.get("/", shopController.findAllShopPublic);
router.get("/:shopId", shopController.findSingleShopPublic);
router.post(
  "/user/shop-following",
  validationMiddleWare(shopFollowSchema.createShopFollowSchema),
  authMiddleWare(UserRole.admin, UserRole.user, UserRole.vendor),
  shopController.shopFollowing
);
router.get(
  "/user/shop-following",
  authMiddleWare(UserRole.admin, UserRole.user, UserRole.vendor),
  shopController.findSingleUserFollow
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
router.get(
  "/admin/find-all-shops",
  authMiddleWare(UserRole.admin),
  shopController.adminFindAllShop
);

export const shopRouter = router;
