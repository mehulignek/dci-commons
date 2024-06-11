import { CustomHttpException } from '../exceptions/custom-http.exception';
import { ResponseModel } from '../models/response.model';

export const customHttpExceptionFormatter = (
  exception: CustomHttpException,
): ResponseModel => {
  return new ResponseModel(
    exception.data ? exception.data : null,
    exception.errorCode || exception.httpCode,
    exception.message,
  );
};
