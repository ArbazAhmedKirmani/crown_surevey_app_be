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
const prisma_1 = __importDefault(require("../prisma"));
const global_helper_1 = require("../../utils/helpers/global.helper");
class OptionService {
    findAll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.options.findMany(Object.assign({ where: { deletedAt: null } }, ((req === null || req === void 0 ? void 0 : req.query) && (0, global_helper_1.getQueryObject)(req.query))));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.options.findUnique({ where: { optionId: id } });
        });
    }
    createOptions(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.default.options.create({ data });
            return result;
        });
    }
}
exports.default = OptionService;
