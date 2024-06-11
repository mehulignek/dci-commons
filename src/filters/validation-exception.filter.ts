import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

import { Response } from 'express';

import { ValidationException } from '../exceptions/validation.exception';
import { validationExceptionFormatter } from '../helpers/validation-exception-formatter';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  public catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const formattedError = validationExceptionFormatter(exception);

    response.status(status).json(formattedError);
  }
}
