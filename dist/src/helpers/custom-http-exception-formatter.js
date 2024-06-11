"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customHttpExceptionFormatter = void 0;
const response_model_1 = require("../models/response.model");
const customHttpExceptionFormatter = (exception) => {
    return new response_model_1.ResponseModel(exception.data ? exception.data : null, exception.errorCode || exception.httpCode, exception.message);
};
exports.customHttpExceptionFormatter = customHttpExceptionFormatter;
//# sourceMappingURL=custom-http-exception-formatter.js.map