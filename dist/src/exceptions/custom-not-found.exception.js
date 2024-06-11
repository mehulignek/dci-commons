"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNotFoundException = void 0;
const custom_http_exception_1 = require("./custom-http.exception");
const common_1 = require("@nestjs/common");
class CustomNotFoundException extends custom_http_exception_1.CustomHttpException {
    constructor(message, data, logNameSpace) {
        super(message, common_1.HttpStatus.NOT_FOUND, data, logNameSpace);
        this.message = message;
        this.data = data;
        this.logNameSpace = logNameSpace;
    }
}
exports.CustomNotFoundException = CustomNotFoundException;
//# sourceMappingURL=custom-not-found.exception.js.map