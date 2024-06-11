import { CustomHttpException } from './custom-http.exception';
export declare class CustomBadRequestExceptionNew extends CustomHttpException {
    logNameSpace: string;
    message: string;
    errorCode?: string;
    data?: any;
    constructor(logNameSpace: string, message: string, errorCode?: string, data?: any);
}
