import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { productController } from "./Product.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { productSchema } from "./Product.zodValidation";

const router = express.Router();

router.post(
  "/",
  validationMiddleWare(productSchema.createProductValidationSchema),
  authMiddleWare(UserRole.vendor),
  productController.createProduct
);

export const productRoutes = router;
