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
const redis_client_1 = __importDefault(require("./redis-client"));
class RedisService {
    static setCache(key, value, expirationSeconds = 3600) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.stringify(value);
                yield redis_client_1.default.set(key, data, { EX: expirationSeconds });
            }
            catch (error) {
                console.error("Failed to set cache:", error);
            }
        });
    }
    static getCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cachedData = yield redis_client_1.default.get(key);
                return cachedData ? JSON.parse(cachedData) : null;
            }
            catch (error) {
                console.error("Failed to get cache:", error);
                return null;
            }
        });
    }
    static deleteCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis_client_1.default.del(key);
            }
            catch (error) {
                console.error("Failed to delete cache:", error);
            }
        });
    }
}
exports.default = RedisService;
