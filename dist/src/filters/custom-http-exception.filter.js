"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const custom_http_exception_1 = require("../exceptions/custom-http.exception");
const custom_http_exception_formatter_1 = require("../helpers/custom-http-exception-formatter");
let CustomHttpExceptionFilter = class CustomHttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const formattedError = (0, custom_http_exception_formatter_1.customHttpExceptionFormatter)(exception);
        response.status(status).json(formattedError);
    }
};
exports.CustomHttpExceptionFilter = CustomHttpExceptionFilter;
exports.CustomHttpExceptionFilter = CustomHttpExceptionFilter = __decorate([
    (0, common_1.Catch)(custom_http_exception_1.CustomHttpException)
], CustomHttpExceptionFilter);
//# sourceMappingURL=custom-http-exception.filter.js.map