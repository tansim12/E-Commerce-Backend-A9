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
router.put(
  "/update-category/:categoryId",
  validationMiddleWare(categoryAndSubCategorySchema.updateCategorySchema),
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.updateCategory
);
router.post(
  "/create-sub-category",
  validationMiddleWare(categoryAndSubCategorySchema.createSubCategorySchema),
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.createSubCategory
);
router.put(
  "/update-sub-category/:subCategoryId",
  validationMiddleWare(categoryAndSubCategorySchema.createCategorySchema),
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.updateSubCategory
);
router.get(
  "/category",
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.findAllCategory
);
router.get(
  "/sub-category",
  authMiddleWare(UserRole.admin),
  categoryAndSubCategoryController.findAllSubCategory
);
export const categoryAndSubCategoryRouter = router;
