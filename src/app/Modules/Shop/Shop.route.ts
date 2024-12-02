import express from "express";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { shopController } from "./Shop.controller";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.admin, UserRole.vendor),
  shopController.createShop
);
router.get("/", shopController.findAllShopPublic);
router.get("/:shopId", shopController.findSingleShopPublic);

export const shopRouter = router;
