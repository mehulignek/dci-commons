"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPayloadTooLarge = void 0;
const common_1 = require("@nestjs/common");
const custom_http_exception_1 = require("./custom-http.exception");
class CustomPayloadTooLarge extends custom_http_exception_1.CustomHttpException {
    constructor(message, data, logNameSpace) {
        super(message, common_1.HttpStatus.PAYLOAD_TOO_LARGE, data, logNameSpace);
        this.message = message;
        this.data = data;
        this.logNameSpace = logNameSpace;
    }
}
exports.CustomPayloadTooLarge = CustomPayloadTooLarge;
//# sourceMappingURL=custom-payload-too-large.exception.js.map