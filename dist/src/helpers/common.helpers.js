"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidJWT = exports.getExternalId = exports.parseJwt = void 0;
function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
exports.parseJwt = parseJwt;
const getExternalId = (partnerId, partnerCustomerId) => {
    return `${partnerId}_${partnerCustomerId}`;
};
exports.getExternalId = getExternalId;
function isValidJWT(token) {
    const parts = token.split('.');
    return parts.length === 3;
}
exports.isValidJWT = isValidJWT;
//# sourceMappingURL=common.helpers.js.map