import { ValidationException } from '../exceptions/validation.exception';
import { ResponseModel } from '../models/response.model';
export declare const validationExceptionFormatter: (exception: ValidationException) => ResponseModel;
