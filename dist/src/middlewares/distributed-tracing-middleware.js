"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedTracingMiddleware = exports.getTracingId = exports.setTracingId = exports.distributedTracingNamespace = void 0;
const cls = require("cls-hooked");
const common_constants_1 = require("../constants/common.constants");
const uuid_1 = require("uuid");
exports.distributedTracingNamespace = cls.createNamespace('distributed-tracing');
const TRACING_ID_KEY = 'tracingId';
const setTracingId = (tracingId) => {
    exports.distributedTracingNamespace.set(TRACING_ID_KEY, tracingId);
};
exports.setTracingId = setTracingId;
const getTracingId = () => {
    return exports.distributedTracingNamespace.get(TRACING_ID_KEY);
};
exports.getTracingId = getTracingId;
const DistributedTracingMiddleware = () => {
    return (req, res, next) => {
        exports.distributedTracingNamespace.bindEmitter(req);
        exports.distributedTracingNamespace.bindEmitter(res);
        const tracingId = req.header(common_constants_1.TRACING_ID_HEADER_KEY) || (0, uuid_1.v4)();
        exports.distributedTracingNamespace.run(() => {
            (0, exports.setTracingId)(tracingId);
            next();
        });
    };
};
exports.DistributedTracingMiddleware = DistributedTracingMiddleware;
//# sourceMappingURL=distributed-tracing-middleware.js.map