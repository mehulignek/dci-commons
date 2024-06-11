import { CustomHttpException } from '../exceptions/custom-http.exception';
import { ResponseModel } from '../models/response.model';
export declare const customHttpExceptionFormatter: (exception: CustomHttpException) => ResponseModel;
