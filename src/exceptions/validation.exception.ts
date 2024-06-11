import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ResponseMessages } from '../constants/response-messages.constants';
import { ValidationConstraints } from '../constants/common.constants';

class ValidationException extends BadRequestException {
  constructor(public readonly validationErrors?: ValidationError[]) {
    super(ResponseMessages.INVALID_REQUEST_PAYLOAD.message);
  }

  getErrorMessage() {
    return this.validationErrors?.length
      ? this.formatErrors(this.validationErrors, '').slice(0, -2)
      : ResponseMessages.INVALID_REQUEST_PAYLOAD.message;
  }

  private formatErrors(
    errors: ValidationError[],
    errorMessage: string,
  ): string {
    if (!errors || errors.length === 0) {
      return errorMessage;
    }

    errors.forEach((error) => {
      if (error.constraints !== undefined) {
        const errorConstraints: string[] = Object.keys(error.constraints);

        if (errorConstraints.includes(ValidationConstraints.IS_ARRAY)) {
          errorMessage +=
            error.constraints[ValidationConstraints.IS_ARRAY] + ', ';
        } else {
          for (const property of errorConstraints) {
            errorMessage += error.constraints[property] + ', ';
          }
        }
      }
      errorMessage = this.formatErrors(error.children, errorMessage);
    });

    return errorMessage;
  }
}
export { ValidationException };
