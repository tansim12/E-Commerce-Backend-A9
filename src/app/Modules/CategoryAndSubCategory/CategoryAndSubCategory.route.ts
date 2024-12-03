import express from "express";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";

import validationMiddleWare from "../../middleware/validationMiddleWare";
import { categoryAndSubCategorySchema } from "./CategoryAndSubCategory.zodValidation";
import { categoryAndSubCategoryController } from "./CategoryAndSubCategory.controller";

const router = express.Router();

router.post(
  "/create-category",
  validationMiddleWare(categoryAndSubCategorySchema.createCategorySchema),
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.createCategory
);
router.post(
  "/create-sub-category",
  validationMiddleWare(categoryAndSubCategorySchema.createSubCategorySchema),
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.createSubCategory
);

export const categoryAndSubCategoryRouter = router;
