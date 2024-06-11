"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNotAcceptable = void 0;
const common_1 = require("@nestjs/common");
const custom_http_exception_1 = require("./custom-http.exception");
class CustomNotAcceptable extends custom_http_exception_1.CustomHttpException {
    constructor(message, data, logNameSpace) {
        super(message, common_1.HttpStatus.NOT_ACCEPTABLE, data, logNameSpace);
        this.message = message;
        this.data = data;
        this.logNameSpace = logNameSpace;
    }
}
exports.CustomNotAcceptable = CustomNotAcceptable;
//# sourceMappingURL=custom-not-acceptable.exception.js.map