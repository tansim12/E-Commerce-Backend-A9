"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const Product_controller_1 = require("./Product.controller");
const validationMiddleWare_1 = __importDefault(require("../../middleware/validationMiddleWare"));
const Product_zodValidation_1 = require("./Product.zodValidation");
const router = express_1.default.Router();
router.get("/", Product_controller_1.productController.publicAllProducts);
router.post("/", (0, validationMiddleWare_1.default)(Product_zodValidation_1.productSchema.createProductValidationSchema), (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.vendor), Product_controller_1.productController.createProduct);
router.put("/:productId", (0, validationMiddleWare_1.default)(Product_zodValidation_1.productSchema.updateProductValidationSchema), (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.vendor, client_1.UserRole.admin), Product_controller_1.productController.updateProduct);
router.get("/shop/shop-all-products", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.vendor), Product_controller_1.productController.findVendorShopAllProducts);
router.get("/admin/all-products", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin), Product_controller_1.productController.adminFindAllProducts);
// public
router.get("/public/top-sale-products", Product_controller_1.productController.publicTopSaleProduct);
router.get("/public/single-product/:productId", Product_controller_1.productController.publicSingleProduct);
router.get("/public/flash-sale/products", Product_controller_1.productController.publicFlashSaleProduct);
router.post("/promo/check", Product_controller_1.productController.publicPromoCheck);
router.post("/compare/compare-products", Product_controller_1.productController.publicCompareProduct);
router.post("/relevant/relevant-products", Product_controller_1.productController.findRelevantProduct);
router.put("/payment/review/:paymentId", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor), Product_controller_1.productController.productReviewByPayment);
router.post("/payment/review-replied", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin, client_1.UserRole.vendor), Product_controller_1.productController.vendorOrShopRepliedReviews);
exports.productRoutes = router;
