"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
class ResponseModel {
    constructor(data, code, message) {
        this.code = code;
        this.message = message || null;
        this.data = data;
    }
}
exports.ResponseModel = ResponseModel;
//# sourceMappingURL=response.model.js.map