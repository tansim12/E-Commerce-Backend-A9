"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Payment_controller_1 = require("./Payment.controller");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole === null || client_1.UserRole === void 0 ? void 0 : client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.vendor), 
// validationMiddleWare(paymentZodValidation.paymentZodSchema),
Payment_controller_1.paymentController.payment);
router.get("/my-payment-info", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole === null || client_1.UserRole === void 0 ? void 0 : client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.vendor), Payment_controller_1.paymentController.myAllPaymentInfo);
router.get("/all-payment-info", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole === null || client_1.UserRole === void 0 ? void 0 : client_1.UserRole.admin, client_1.UserRole.vendor), Payment_controller_1.paymentController.allPaymentInfo);
router.get("/shop-all-payment-info", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.vendor), Payment_controller_1.paymentController.shopAllPayment);
router.post("/callback", Payment_controller_1.paymentController.callback);
router.put("/payment-update/:paymentId", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin, client_1.UserRole.vendor), Payment_controller_1.paymentController.adminAndVendorUpdatePayment);
exports.paymentRoutes = router;
