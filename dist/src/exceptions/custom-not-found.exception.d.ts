import { CustomHttpException } from './custom-http.exception';
export declare class CustomNotFoundException extends CustomHttpException {
    message: string;
    data?: any;
    logNameSpace?: string;
    constructor(message: string, data?: any, logNameSpace?: string);
}
