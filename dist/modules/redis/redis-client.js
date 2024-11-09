"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const app_config_1 = __importDefault(require("../../utils/config/app.config"));
class RedisClient {
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = (0, redis_1.createClient)({
                url: app_config_1.default.REDIS.URL,
            });
            RedisClient.instance.on("error", (err) => {
                console.error("Redis Client Error:", err);
            });
            RedisClient.instance.connect().then(() => {
                console.log("Connected to Redis");
            });
        }
        return RedisClient.instance;
    }
}
exports.default = RedisClient.getInstance();
