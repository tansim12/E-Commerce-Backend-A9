"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/Error-Handler/globalErrorHandler"));
const normalMiddleware_1 = __importDefault(require("./app/middleware/normalMiddleware"));
const Auth_route_1 = require("./app/Modules/Auth/Auth.route");
const User_route_1 = require("./app/Modules/User/User.route");
const Shop_route_1 = require("./app/Modules/Shop/Shop.route");
const CategoryAndSubCategory_route_1 = require("./app/Modules/CategoryAndSubCategory/CategoryAndSubCategory.route");
const Product_route_1 = require("./app/Modules/Product/Product.route");
const Payment_route_1 = require("./app/Modules/Payment/Payment.route");
const Analytics_route_1 = require("./app/Modules/Analytics/Analytics.route");
const app = (0, express_1.default)();
(0, normalMiddleware_1.default)(app);
app.get("/", (req, res) => {
    res.send({
        Message: "A-9-Postgres-Prisma  server..",
    });
});
app.use("/api/auth", Auth_route_1.AuthRoutes);
app.use("/api/user", User_route_1.userRouter);
app.use("/api/shop", Shop_route_1.shopRouter);
app.use("/api/cAndSubC", CategoryAndSubCategory_route_1.categoryAndSubCategoryRouter);
app.use("/api/product", Product_route_1.productRoutes);
app.use("/api/payment", Payment_route_1.paymentRoutes);
app.use("/api/analytics", Analytics_route_1.analyticsRoutes);
app.all("*", (req, res, next) => {
    const error = new Error(`Can't find ${req.url} on the server`);
    next(error);
});
// global error handle
app.use(globalErrorHandler_1.default);
exports.default = app;
