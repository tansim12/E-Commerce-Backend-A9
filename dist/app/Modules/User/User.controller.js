"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_service_1 = require("./User.service");
const successResponse_1 = require("../../Re-useable/successResponse");
const pick_1 = __importDefault(require("../../shared/pick"));
const User_const_1 = require("./User.const");
const http_status_codes_1 = require("http-status-codes");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, User_const_1.userFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield User_service_1.userService.getAllUsersDB(filters, options);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find all user"));
    }
    catch (error) {
        next(error);
    }
});
//! access image
// if (req?.file?.path) {
//   adminData = { ...adminData, profilePhoto: req.file.path };
// }
//!todo  পরে update এর কাজ করবো
const adminUpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield User_service_1.userService.adminUpdateUserDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.userId, req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "User Info update successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const findMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_service_1.userService.findMyProfileDB(req === null || req === void 0 ? void 0 : req.user);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "User profile data get successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const updateMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_service_1.userService.updateMyProfileDB(req === null || req === void 0 ? void 0 : req.user, req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "User profile data get successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield User_service_1.userService.getSingleUserDB((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.userId);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "Single user data get successfully done"));
    }
    catch (error) {
        next(error);
    }
});
const createWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User_service_1.userService.createWishlistDB(req === null || req === void 0 ? void 0 : req.user, req === null || req === void 0 ? void 0 : req.body);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find  user wishlist"));
    }
    catch (error) {
        next(error);
    }
});
const findUserAllWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, User_const_1.userWishListFilterAbleFields);
        const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
        const result = yield User_service_1.userService.findUserAllWishListDB(filters, options, req === null || req === void 0 ? void 0 : req.user);
        res.send((0, successResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.OK, "find  user wishlist"));
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    getAllUsers,
    adminUpdateUser,
    findMyProfile,
    updateMyProfile,
    getSingleUser,
    createWishlist,
    findUserAllWishList,
};
