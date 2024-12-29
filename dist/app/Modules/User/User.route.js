"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const validationMiddleWare_1 = __importDefault(require("../../middleware/validationMiddleWare"));
const User_ZodValidation_1 = require("./User.ZodValidation");
const router = express_1.default.Router();
//! upload file
router.get("/", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin), User_controller_1.userController.getAllUsers);
router.get("/:userId", User_controller_1.userController.getSingleUser);
router.get("/find/my-profile", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor), User_controller_1.userController.findMyProfile);
router.put("/update-my-profile", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor), User_controller_1.userController.updateMyProfile);
router.put("/admin-update-user/:userId", (0, validationMiddleWare_1.default)(User_ZodValidation_1.userZodValidation.updateUserZodSchema), (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin), User_controller_1.userController.adminUpdateUser);
router.post("/wishList", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user), User_controller_1.userController.createWishlist);
router.get("/wishList/all", (0, authMiddleware_1.authMiddleWare)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user), User_controller_1.userController.findUserAllWishList);
exports.userRouter = router;
