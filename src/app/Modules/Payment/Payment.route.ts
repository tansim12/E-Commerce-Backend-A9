import express from "express";

import { paymentController } from "./Payment.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleware";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole?.admin, UserRole.user, UserRole.vendor),
  // validationMiddleWare(paymentZodValidation.paymentZodSchema),
  paymentController.payment
);
router.get(
  "/my-payment-info",
  authMiddleWare(UserRole?.admin, UserRole.user, UserRole.vendor),
  paymentController.myAllPaymentInfo
);
router.get(
  "/all-payment-info",
  authMiddleWare(UserRole?.admin, UserRole.vendor),
  paymentController.allPaymentInfo
);
router.get(
  "/shop-all-payment-info",
  authMiddleWare(UserRole.vendor),
  paymentController.shopAllPayment
);

router.post("/callback", paymentController.callback);
router.put(
  "/payment-update/:paymentId",
  authMiddleWare(UserRole.admin, UserRole.vendor),
  paymentController.adminAndVendorUpdatePayment
);

export const paymentRoutes = router;
