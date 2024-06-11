import { maskJSON2 } from 'maskdata';

export const aadharMaskConfig = {
    cardMaskOptions: {
      maskWith: 'X',
      unmaskedStartDigits: 0,
      unmaskedEndDigits: 4,
    },
    cardFields: ['aadhaarNumber', 'aadhaarNo'],
};
  
export const SENSITIVE_DATA_LOGS_MASK_INFO = [
    {
      urlRegex: '^/v1/loan-applications/[0-9]+/aadhaar/send-otp$',
      maskUtility: maskJSON2,
      maskOptions: aadharMaskConfig,
    },
    {
      urlRegex: '^/v1/loan-applications/[0-9]+/aadhaar/verify-otp$',
      maskUtility: maskJSON2,
      maskOptions: aadharMaskConfig,
    },
    {
      urlRegex: '^/v2/loan-applications/[A-Za-z0-9_]+/aadhaar/verify-otp$',
      maskUtility: maskJSON2,
      maskOptions: aadharMaskConfig,
    },
    {
      urlRegex: '^/v2/loan-applications/[A-Za-z0-9_]+/aadhaar/send-otp$',
      maskUtility: maskJSON2,
      maskOptions: aadharMaskConfig,
    },
];
  