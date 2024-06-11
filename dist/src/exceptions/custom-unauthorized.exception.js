"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUnauthorizedException = void 0;
const common_1 = require("@nestjs/common");
const custom_http_exception_1 = require("./custom-http.exception");
class CustomUnauthorizedException extends custom_http_exception_1.CustomHttpException {
    constructor(message, data, logNameSpace) {
        super(message, common_1.HttpStatus.UNAUTHORIZED, data, logNameSpace);
        this.message = message;
        this.data = data;
        this.logNameSpace = logNameSpace;
    }
}
exports.CustomUnauthorizedException = CustomUnauthorizedException;
//# sourceMappingURL=custom-unauthorized.exception.js.map