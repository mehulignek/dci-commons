"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
const response_messages_constants_1 = require("../constants/response-messages.constants");
const common_constants_1 = require("../constants/common.constants");
class ValidationException extends common_1.BadRequestException {
    constructor(validationErrors) {
        super(response_messages_constants_1.ResponseMessages.INVALID_REQUEST_PAYLOAD.message);
        this.validationErrors = validationErrors;
    }
    getErrorMessage() {
        var _a;
        return ((_a = this.validationErrors) === null || _a === void 0 ? void 0 : _a.length)
            ? this.formatErrors(this.validationErrors, '').slice(0, -2)
            : response_messages_constants_1.ResponseMessages.INVALID_REQUEST_PAYLOAD.message;
    }
    formatErrors(errors, errorMessage) {
        if (!errors || errors.length === 0) {
            return errorMessage;
        }
        errors.forEach((error) => {
            if (error.constraints !== undefined) {
                const errorConstraints = Object.keys(error.constraints);
                if (errorConstraints.includes(common_constants_1.ValidationConstraints.IS_ARRAY)) {
                    errorMessage +=
                        error.constraints[common_constants_1.ValidationConstraints.IS_ARRAY] + ', ';
                }
                else {
                    for (const property of errorConstraints) {
                        errorMessage += error.constraints[property] + ', ';
                    }
                }
            }
            errorMessage = this.formatErrors(error.children, errorMessage);
        });
        return errorMessage;
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=validation.exception.js.map