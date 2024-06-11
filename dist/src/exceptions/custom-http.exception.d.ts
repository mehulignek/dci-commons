import { HttpException, HttpStatus } from '@nestjs/common';
export declare class CustomHttpException extends HttpException {
    message: string;
    httpCode: HttpStatus;
    data?: any;
    logNameSpace?: string;
    errorCode?: string;
    constructor(message: string, httpCode: HttpStatus, data?: any, logNameSpace?: string, errorCode?: string);
}
