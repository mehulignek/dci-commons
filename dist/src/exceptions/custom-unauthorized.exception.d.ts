import { CustomHttpException } from './custom-http.exception';
export declare class CustomUnauthorizedException extends CustomHttpException {
    message: string;
    data?: any;
    logNameSpace?: string;
    constructor(message: string, data?: any, logNameSpace?: string);
}
