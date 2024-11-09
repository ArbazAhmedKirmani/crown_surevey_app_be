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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = __importDefault(require("../config/app.config"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_b = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")) === null || _b === void 0 ? void 0 : _b[1];
        if (!token || token === "undefined")
            return res.status(401).json({ error: "Access denied." });
        const result = jsonwebtoken_1.default.verify(token, app_config_1.default.JWT.SECRET_KEY);
        if (!result)
            return res.status(403).json({ error: "Invalid token." });
        req["user"] = result;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Access denied. Token expired" });
    }
});
exports.default = authenticateToken;
