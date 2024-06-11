"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENSITIVE_DATA_LOGS_MASK_INFO = exports.aadharMaskConfig = void 0;
const maskdata_1 = require("maskdata");
exports.aadharMaskConfig = {
    cardMaskOptions: {
        maskWith: 'X',
        unmaskedStartDigits: 0,
        unmaskedEndDigits: 4,
    },
    cardFields: ['aadhaarNumber', 'aadhaarNo'],
};
exports.SENSITIVE_DATA_LOGS_MASK_INFO = [
    {
        urlRegex: '^/v1/loan-applications/[0-9]+/aadhaar/send-otp$',
        maskUtility: maskdata_1.maskJSON2,
        maskOptions: exports.aadharMaskConfig,
    },
    {
        urlRegex: '^/v1/loan-applications/[0-9]+/aadhaar/verify-otp$',
        maskUtility: maskdata_1.maskJSON2,
        maskOptions: exports.aadharMaskConfig,
    },
    {
        urlRegex: '^/v2/loan-applications/[A-Za-z0-9_]+/aadhaar/verify-otp$',
        maskUtility: maskdata_1.maskJSON2,
        maskOptions: exports.aadharMaskConfig,
    },
    {
        urlRegex: '^/v2/loan-applications/[A-Za-z0-9_]+/aadhaar/send-otp$',
        maskUtility: maskdata_1.maskJSON2,
        maskOptions: exports.aadharMaskConfig,
    },
];
//# sourceMappingURL=maskdata.constant.js.map