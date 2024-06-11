"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHttpException = void 0;
const common_1 = require("@nestjs/common");
class CustomHttpException extends common_1.HttpException {
    constructor(message, httpCode, data, logNameSpace, errorCode) {
        super(message, httpCode);
        this.message = message;
        this.httpCode = httpCode;
        this.data = data;
        this.logNameSpace = logNameSpace;
        this.errorCode = errorCode;
    }
}
exports.CustomHttpException = CustomHttpException;
//# sourceMappingURL=custom-http.exception.js.map