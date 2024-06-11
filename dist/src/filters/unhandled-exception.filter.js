"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhandledExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../services/logger.service");
const response_messages_constants_1 = require("../constants/response-messages.constants");
const response_model_1 = require("../models/response.model");
const custom_http_exception_filter_1 = require("./custom-http-exception.filter");
const axios_1 = require("axios");
const custom_http_exception_1 = require("../exceptions/custom-http.exception");
let UnhandledExceptionFilter = class UnhandledExceptionFilter {
    constructor() {
        this.logNameSpace = `Filters.${custom_http_exception_filter_1.CustomHttpExceptionFilter.name}`;
    }
    catch(exception, host) {
        var _a;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof custom_http_exception_1.CustomHttpException) {
            logger_service_1.Logger.error(exception.logNameSpace, { data: exception });
            return response
                .status(exception.httpCode)
                .json(new response_model_1.ResponseModel(exception.data, (exception === null || exception === void 0 ? void 0 : exception.errorCode) || exception.httpCode, exception.message));
        }
        if (exception instanceof common_1.HttpException) {
            const exceptionCopy = exception;
            logger_service_1.Logger.error(exceptionCopy, '', `${this.logNameSpace}.httpException`);
            if (exceptionCopy.status === common_1.HttpStatus.NOT_FOUND) {
                return response
                    .status(common_1.HttpStatus.NOT_FOUND)
                    .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.NOT_FOUND.code, response_messages_constants_1.ResponseMessages.NOT_FOUND.message));
            }
            if (exceptionCopy.status === common_1.HttpStatus.BAD_REQUEST) {
                return response
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json(new response_model_1.ResponseModel(exceptionCopy.response.error, exceptionCopy.response.statusCode, exceptionCopy.response.message));
            }
            if (exceptionCopy.status === common_1.HttpStatus.PAYMENT_REQUIRED) {
                return response
                    .status(common_1.HttpStatus.PAYMENT_REQUIRED)
                    .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.PAYMENT_REQUIRED.code, response_messages_constants_1.ResponseMessages.PAYMENT_REQUIRED.message));
            }
            if (exceptionCopy.status === common_1.HttpStatus.SERVICE_UNAVAILABLE ||
                exceptionCopy.status === common_1.HttpStatus.BAD_GATEWAY) {
                return response
                    .status(common_1.HttpStatus.SERVICE_UNAVAILABLE)
                    .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.SERVICE_UNAVAILABLE.code, response_messages_constants_1.ResponseMessages.SERVICE_UNAVAILABLE.message));
            }
            return response
                .status(exceptionCopy.status)
                .json(new response_model_1.ResponseModel(null, exceptionCopy.status, (_a = exceptionCopy === null || exceptionCopy === void 0 ? void 0 : exceptionCopy.response) === null || _a === void 0 ? void 0 : _a.message));
        }
        if (exception instanceof axios_1.AxiosError) {
            const exceptionCopy = exception;
            logger_service_1.Logger.error(exceptionCopy, '', `${this.logNameSpace}.AxiosError`);
            if (exceptionCopy.response.status === common_1.HttpStatus.PAYMENT_REQUIRED) {
                return response
                    .status(common_1.HttpStatus.PAYMENT_REQUIRED)
                    .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.PAYMENT_REQUIRED.code, response_messages_constants_1.ResponseMessages.PAYMENT_REQUIRED.message));
            }
            if (exceptionCopy.response.status === common_1.HttpStatus.SERVICE_UNAVAILABLE ||
                exceptionCopy.response.status === common_1.HttpStatus.BAD_GATEWAY) {
                return response
                    .status(common_1.HttpStatus.SERVICE_UNAVAILABLE)
                    .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.SERVICE_UNAVAILABLE.code, response_messages_constants_1.ResponseMessages.SERVICE_UNAVAILABLE.message));
            }
        }
        logger_service_1.Logger.error(`${this.logNameSpace}.internalServerError`, '', exception);
        return response
            .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json(new response_model_1.ResponseModel(null, response_messages_constants_1.ResponseMessages.SERVER_ERROR.code, response_messages_constants_1.ResponseMessages.SERVER_ERROR.message));
    }
};
exports.UnhandledExceptionFilter = UnhandledExceptionFilter;
exports.UnhandledExceptionFilter = UnhandledExceptionFilter = __decorate([
    (0, common_1.Catch)()
], UnhandledExceptionFilter);
//# sourceMappingURL=unhandled-exception.filter.js.map