import { ValidationException } from '../exceptions/validation.exception';
import { ResponseMessages } from '../constants/response-messages.constants';
import { ResponseModel } from '../models/response.model';

export const validationExceptionFormatter = (
  exception: ValidationException,
): ResponseModel => {
  return new ResponseModel(
    exception.validationErrors,
    ResponseMessages.INVALID_REQUEST_PAYLOAD.code,
    exception.getErrorMessage(),
  );
};
