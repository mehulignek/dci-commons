import { CustomHttpExceptionMessageModel } from '../models/custom-http-exception-message.model';
export declare class ResponseMessages {
    static readonly SUCCESS: CustomHttpExceptionMessageModel;
    static readonly SERVER_ERROR: CustomHttpExceptionMessageModel;
    static readonly NOT_FOUND: CustomHttpExceptionMessageModel;
    static readonly INVALID_REQUEST_PAYLOAD: CustomHttpExceptionMessageModel;
    static readonly SERVICE_UNAVAILABLE: CustomHttpExceptionMessageModel;
    static readonly PAYMENT_REQUIRED: CustomHttpExceptionMessageModel;
}
