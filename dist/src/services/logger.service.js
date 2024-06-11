"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMobileNumberFromJwtToken = exports.ApiLoggerMiddleware = exports.Logger = void 0;
const winston_1 = require("winston");
const rTracer = require("cls-rtracer");
const lodash_1 = require("lodash");
const express_winston_1 = require("express-winston");
const default_1 = require("../../config/default");
const request_method_enum_1 = require("../enums/request-method.enum");
const moment = require("moment");
const maskdata_constant_1 = require("../constants/maskdata.constant");
const distributed_tracing_middleware_1 = require("../middlewares/distributed-tracing-middleware");
const common_helpers_1 = require("../helpers/common.helpers");
const common_constants_1 = require("../constants/common.constants");
const OMITTED_KEYS_FROM_LOG_OBJECT = [
    'message',
    'level',
    'timestamp',
    'namespace',
    'meta',
    'meta.req',
    'meta.res',
    'error',
    'error_stack',
];
const CONFIGURED_LOG_LEVEL = default_1.ENV_PARAMS.serverLogLevel || 'info';
const addCustomAttributesToLogObject = (0, winston_1.format)((info, opts) => {
    const data = {
        correlation_id: rTracer.id(),
        tracingId: (0, distributed_tracing_middleware_1.getTracingId)(),
        level: info.level,
        timestamp: info.timestamp,
        message: info.message,
        type: opts.tag,
    };
    if (opts.tag === 'app') {
        return Object.assign(Object.assign(Object.assign({}, (0, lodash_1.omit)(info, OMITTED_KEYS_FROM_LOG_OBJECT)), data), { namespace: info.namespace, error: info.error, error_stack: info.error_stack, meta: info.meta });
    }
    else {
        const authorizationToken = (0, lodash_1.get)(info, 'meta.req.headers["authorization"]');
        const authTokenPayload = authorizationToken && (0, common_helpers_1.isValidJWT)(authorizationToken)
            ? (0, common_helpers_1.parseJwt)((0, lodash_1.get)(info, 'meta.req.headers["authorization"]'))
            : null;
        return Object.assign(Object.assign({}, (0, lodash_1.omit)(info, OMITTED_KEYS_FROM_LOG_OBJECT)), { log: Object.assign({}, data), req: Object.assign({ url: (0, lodash_1.get)(info, 'meta.req.url'), method: (0, lodash_1.get)(info, 'meta.req.method'), referer: (0, lodash_1.get)(info, 'meta.req.headers.referer'), userAgent: (0, lodash_1.get)(info, 'meta.req.headers["user-agent"]'), userIp: (0, lodash_1.get)(info, 'meta.req.headers["x-forwarded-for"]'), httpVersion: (0, lodash_1.get)(info, 'meta.req.httpVersion'), body: (0, lodash_1.get)(info, 'meta.req.body'), query: (0, lodash_1.get)(info, 'meta.req.query') }, (authTokenPayload && {
                userExternalId: (0, common_helpers_1.getExternalId)(authTokenPayload.partnerId, authTokenPayload.partnerCustomerId),
                userId: getCustomerIdFromJwtToken((0, lodash_1.get)(info, 'meta.req.headers["authorization"]')),
                mobileNumber: authTokenPayload.mobileNumber,
            })), res: {
                body: (0, lodash_1.get)(info, 'meta.res.body'),
                statusCode: (0, lodash_1.get)(info, 'meta.res.statusCode'),
            } });
    }
});
const CONFIGURED_TRANSPORTS = [
    new winston_1.transports.Console({ level: CONFIGURED_LOG_LEVEL }),
];
const timezoned = () => {
    return moment().utcOffset('+05:30').format();
};
class AppLogger {
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            format: winston_1.format.combine(winston_1.format.timestamp({ format: timezoned }), addCustomAttributesToLogObject({ tag: 'app' }), winston_1.format.json()),
            transports: CONFIGURED_TRANSPORTS,
        });
    }
    info(namespace, meta) {
        this.logger.log(`info`, '', {
            namespace,
            meta,
        });
    }
    error(namespace, error, meta) {
        this.logger.log(`error`, '', {
            namespace,
            error_stack: error instanceof Error ? error.stack : error,
            error,
            meta,
        });
    }
    warn(namespace, meta) {
        this.logger.log(`warn`, '', {
            namespace,
            meta,
        });
    }
    debug(namespace, meta) {
        this.logger.log(`debug`, '', {
            namespace,
            meta,
        });
    }
    log(message, namespace) {
        this.logger.log(`info`, message, { namespace });
    }
}
exports.Logger = new AppLogger();
exports.ApiLoggerMiddleware = (0, express_winston_1.logger)({
    transports: CONFIGURED_TRANSPORTS,
    format: winston_1.format.combine(winston_1.format.timestamp({ format: timezoned }), addCustomAttributesToLogObject({ tag: 'access' }), winston_1.format.json()),
    expressFormat: true,
    requestWhitelist: [...express_winston_1.requestWhitelist, 'body'],
    responseWhitelist: [...express_winston_1.responseWhitelist, 'body'],
    requestFilter: (req, propName) => {
        if (propName === 'body') {
            let maskedData = req.body;
            maskdata_constant_1.SENSITIVE_DATA_LOGS_MASK_INFO.forEach((info) => {
                var _a;
                if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.match(info.urlRegex)) {
                    maskedData = info.maskUtility(req.body, info.maskOptions);
                }
            });
            req[propName] = maskedData;
            return req[propName];
        }
        else {
            return req[propName];
        }
    },
    ignoreRoute: (req) => {
        const ignoredRoutes = [
            { method: request_method_enum_1.RequestMethod.GET, path: common_constants_1.LIGHT_API_HEALTH_END_POINT },
            { method: request_method_enum_1.RequestMethod.GET, path: common_constants_1.PARTNER_GATEWAY_HEALTH_END_POINT },
            { method: request_method_enum_1.RequestMethod.GET, path: common_constants_1.DL_MIDDLEWARE_HEALTH_END_POINT },
        ];
        const isExcludedPath = (request) => {
            const routeInfo = {
                path: request.url,
                method: request_method_enum_1.RequestMethod[request.method],
            };
            return (ignoredRoutes.findIndex((route) => {
                return (route.path === routeInfo.path && route.method === routeInfo.method);
            }) > -1);
        };
        return isExcludedPath(req);
    },
});
function getMobileNumberFromJwtToken(token) {
    try {
        const tokenSplits = token.split(' ');
        if ((tokenSplits === null || tokenSplits === void 0 ? void 0 : tokenSplits.length) &&
            tokenSplits[0].trim().toLocaleLowerCase() === 'bearer') {
            const jwtToken = tokenSplits[1];
            const tokenPayload = (0, common_helpers_1.parseJwt)(jwtToken);
            return tokenPayload['mobileNumber'];
        }
    }
    catch (err) {
        return undefined;
    }
    return undefined;
}
exports.getMobileNumberFromJwtToken = getMobileNumberFromJwtToken;
function getCustomerIdFromJwtToken(token) {
    try {
        const tokenSplits = token.split(' ');
        if ((tokenSplits === null || tokenSplits === void 0 ? void 0 : tokenSplits.length) &&
            tokenSplits[0].trim().toLocaleLowerCase() === 'bearer') {
            const jwtToken = tokenSplits[1];
            const tokenPayload = (0, common_helpers_1.parseJwt)(jwtToken);
            return tokenPayload['userId'];
        }
    }
    catch (err) {
        return undefined;
    }
    return undefined;
}
//# sourceMappingURL=logger.service.js.map