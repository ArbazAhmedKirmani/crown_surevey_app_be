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
exports.comparePassword = exports.hashPassword = exports.getQueryObject = void 0;
const bcrypt = require("bcrypt");
const app_config_1 = __importDefault(require("../config/app.config"));
const saltRounds = 10;
const getQueryObject = (query) => ({
    take: Number(query === null || query === void 0 ? void 0 : query.take) || app_config_1.default.QUERY.TOP,
    skip: Number(query === null || query === void 0 ? void 0 : query.skip) || app_config_1.default.QUERY.SKIP,
});
exports.getQueryObject = getQueryObject;
const hashPassword = (myPlaintextPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hash) => {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
exports.comparePassword = comparePassword;
