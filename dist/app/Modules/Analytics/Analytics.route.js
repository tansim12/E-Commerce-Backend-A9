"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const client_1 = require("@prisma/client");
const Analytics_controller_1 = require("./Analytics.controller");
const router = express_1.default.Router();
router.get("/admin", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin), Analytics_controller_1.analyticsController.adminAnalytics);
router.get("/shop", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.vendor), Analytics_controller_1.analyticsController.shopAnalytics);
router.post("/newsletter", Analytics_controller_1.analyticsController.createNewsletter);
router.get("/newsletter", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin), Analytics_controller_1.analyticsController.findAllNewsLetterEmail);
exports.analyticsRoutes = router;
