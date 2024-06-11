"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomBadRequestExceptionNew = void 0;
const common_1 = require("@nestjs/common");
const custom_http_exception_1 = require("./custom-http.exception");
class CustomBadRequestExceptionNew extends custom_http_exception_1.CustomHttpException {
    constructor(logNameSpace, message, errorCode, data) {
        super(message, common_1.HttpStatus.BAD_REQUEST, data, logNameSpace, errorCode);
        this.logNameSpace = logNameSpace;
        this.message = message;
        this.errorCode = errorCode;
        this.data = data;
    }
}
exports.CustomBadRequestExceptionNew = CustomBadRequestExceptionNew;
//# sourceMappingURL=custom-bad-request-new.exception.js.map