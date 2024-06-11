import { maskJSON2 } from 'maskdata';
export declare const aadharMaskConfig: {
    cardMaskOptions: {
        maskWith: string;
        unmaskedStartDigits: number;
        unmaskedEndDigits: number;
    };
    cardFields: string[];
};
export declare const SENSITIVE_DATA_LOGS_MASK_INFO: {
    urlRegex: string;
    maskUtility: typeof maskJSON2;
    maskOptions: {
        cardMaskOptions: {
            maskWith: string;
            unmaskedStartDigits: number;
            unmaskedEndDigits: number;
        };
        cardFields: string[];
    };
}[];
