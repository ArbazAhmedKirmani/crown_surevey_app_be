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
const response_helper_1 = require("../../utils/helpers/response.helper");
const prisma_1 = __importDefault(require("../prisma"));
class SchemaService {
    constructor() { }
    getAllSchema(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.default.templateSchema.findMany(Object.assign({ where: {
                    deletedAt: null,
                } }, (0, response_helper_1.ListingQueryData)(query)));
            const count = yield prisma_1.default.templateSchema.count({
                where: {
                    deletedAt: null,
                },
            });
            return { result, count };
        });
    }
}
exports.default = SchemaService;
