"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingQueryData = exports.SuccessResponse = void 0;
function SuccessResponse(data, message = "Success", statusCode = 200) {
    return { data, message, statusCode, ok: true };
}
exports.SuccessResponse = SuccessResponse;
const ListingQueryData = (query) => {
    return Object.assign(Object.assign({}, ((query === null || query === void 0 ? void 0 : query.direction) && {
        orderBy: {
            [(query === null || query === void 0 ? void 0 : query.orderBy) || "createdAt"]: query === null || query === void 0 ? void 0 : query.direction,
        },
    })), ((query === null || query === void 0 ? void 0 : query.page) &&
        (query === null || query === void 0 ? void 0 : query.limit) && {
        skip: (+(query === null || query === void 0 ? void 0 : query.page) - 1) * parseInt(query === null || query === void 0 ? void 0 : query.limit),
        take: parseInt(query === null || query === void 0 ? void 0 : query.limit),
    }));
};
exports.ListingQueryData = ListingQueryData;
