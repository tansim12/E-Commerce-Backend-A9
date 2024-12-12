"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonDataSetMiddleware = void 0;
const jsonDataSetMiddleware = (req, res, next) => {
    var _a;
    try {
        req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.jsonDataSetMiddleware = jsonDataSetMiddleware;
