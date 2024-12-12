import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { productController } from "./Product.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { productSchema } from "./Product.zodValidation";

const router = express.Router();

router.get("/", productController.publicAllProducts);
router.post(
  "/",
  validationMiddleWare(productSchema.createProductValidationSchema),
  authMiddleWare(UserRole.vendor),
  productController.createProduct
);
router.put(
  "/:productId",
  validationMiddleWare(productSchema.updateProductValidationSchema),
  authMiddleWare(UserRole.vendor, UserRole.admin),
  productController.updateProduct
);
router.get(
  "/shop/shop-all-products",
  authMiddleWare(UserRole.vendor),
  productController.findVendorShopAllProducts
);
router.get(
  "/admin/all-products",
  authMiddleWare(UserRole.admin),
  productController.adminFindAllProducts
);

// public
router.get("/public/top-sale-products", productController.publicTopSaleProduct);
router.get(
  "/public/single-product/:productId",
  productController.publicSingleProduct
);
router.get(
  "/public/flash-sale/products",
  productController.publicFlashSaleProduct
);
router.post("/promo/check", productController.publicPromoCheck);
router.post(
  "/compare/compare-products",
  productController.publicCompareProduct
);
router.post(
  "/relevant/relevant-products",
  productController.findRelevantProduct
);
router.put(
  "/payment/review/:paymentId",
  authMiddleWare(UserRole.user, UserRole.admin, UserRole.vendor),
  productController.productReviewByPayment
);
router.post(
  "/payment/review-replied",
  authMiddleWare(UserRole.admin, UserRole.vendor),
  productController.vendorOrShopRepliedReviews
);

export const productRoutes = router;
