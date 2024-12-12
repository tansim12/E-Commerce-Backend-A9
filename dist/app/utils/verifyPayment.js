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
exports.verifyPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyPayment = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(process.env.AAMAR_PAY_SEARCH_TNX_BASE_URL, {
        params: {
            signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
            store_id: "aamarpaytest",
            request_id: txnId,
            type: "json",
        },
    });
    return response === null || response === void 0 ? void 0 : response.data;
});
exports.verifyPayment = verifyPayment;
