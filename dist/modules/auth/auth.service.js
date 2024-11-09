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
const app_config_1 = __importDefault(require("../../utils/config/app.config"));
const global_helper_1 = require("../../utils/helpers/global.helper");
const app_error_middleware_1 = __importDefault(require("../../utils/middlewares/app-error.middleware"));
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.default.users.findUnique({
                where: { email: body.email, deletedAt: null },
                select: { email: true, password: true, name: true },
            });
            if (!result) {
                throw new app_error_middleware_1.default("Email not found", 404);
            }
            if (!(yield (0, global_helper_1.comparePassword)(body.password, result.password))) {
                throw new app_error_middleware_1.default("Password is Incorrect", 400);
            }
            delete result.password;
            const token = jsonwebtoken_1.default.sign(result, app_config_1.default.JWT.SECRET_KEY, {
                algorithm: "HS256",
                expiresIn: app_config_1.default.JWT.TOKEN_EXPIRY,
            });
            return Object.assign(Object.assign({}, result), { token });
        });
    }
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = yield prisma_1.default.users.findFirst({
                where: { email: body.email, deletedAt: null },
            });
            if (userEmail) {
                throw new app_error_middleware_1.default("Email already exists", 403);
            }
            const hashedPassword = yield (0, global_helper_1.hashPassword)(body.password);
            const result = prisma_1.default.users.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                },
            });
            return result;
        });
    }
}
exports.default = AuthService;
