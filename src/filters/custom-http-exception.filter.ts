import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from '../exceptions/custom-http.exception';
import { customHttpExceptionFormatter } from '../helpers/custom-http-exception-formatter';
@Catch(CustomHttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  public catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const formattedError = customHttpExceptionFormatter(exception);
    response.status(status).json(formattedError);
  }
}
