import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { Logger } from '../services/logger.service';
import { ResponseMessages } from '../constants/response-messages.constants';
import { ResponseModel } from '../models/response.model';
import { CustomHttpExceptionFilter } from './custom-http-exception.filter';
import { AxiosError } from 'axios';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  private logNameSpace = `Filters.${CustomHttpExceptionFilter.name}`;

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof CustomHttpException) {
      Logger.error(exception.logNameSpace, { data: exception });

      return response
        .status(exception.httpCode)
        .json(
          new ResponseModel(
            exception.data,
            exception?.errorCode || exception.httpCode,
            exception.message,
          ),
        );
    }

    if (exception instanceof HttpException) {
      const exceptionCopy = exception as any;

      Logger.error(exceptionCopy, '', `${this.logNameSpace}.httpException`);

      if (exceptionCopy.status === HttpStatus.NOT_FOUND) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json(
            new ResponseModel(
              null,
              ResponseMessages.NOT_FOUND.code,
              ResponseMessages.NOT_FOUND.message,
            ),
          );
      }

      if (exceptionCopy.status === HttpStatus.BAD_REQUEST) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ResponseModel(
              exceptionCopy.response.error,
              exceptionCopy.response.statusCode,
              exceptionCopy.response.message,
            ),
          );
      }

      if (exceptionCopy.status === HttpStatus.PAYMENT_REQUIRED) {
        return response
          .status(HttpStatus.PAYMENT_REQUIRED)
          .json(
            new ResponseModel(
              null,
              ResponseMessages.PAYMENT_REQUIRED.code,
              ResponseMessages.PAYMENT_REQUIRED.message,
            ),
          );
      }

      if (
        exceptionCopy.status === HttpStatus.SERVICE_UNAVAILABLE ||
        exceptionCopy.status === HttpStatus.BAD_GATEWAY
      ) {
        return response
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json(
            new ResponseModel(
              null,
              ResponseMessages.SERVICE_UNAVAILABLE.code,
              ResponseMessages.SERVICE_UNAVAILABLE.message,
            ),
          );
      }

      return response
        .status(exceptionCopy.status)
        .json(
          new ResponseModel(
            null,
            exceptionCopy.status,
            exceptionCopy?.response?.message,
          ),
        );
    }

    if (exception instanceof AxiosError) {
      const exceptionCopy = exception as any;

      Logger.error(exceptionCopy, '', `${this.logNameSpace}.AxiosError`);

      if (exceptionCopy.response.status === HttpStatus.PAYMENT_REQUIRED) {
        return response
          .status(HttpStatus.PAYMENT_REQUIRED)
          .json(
            new ResponseModel(
              null,
              ResponseMessages.PAYMENT_REQUIRED.code,
              ResponseMessages.PAYMENT_REQUIRED.message,
            ),
          );
      }

      if (
        exceptionCopy.response.status === HttpStatus.SERVICE_UNAVAILABLE ||
        exceptionCopy.response.status === HttpStatus.BAD_GATEWAY
      ) {
        return response
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json(
            new ResponseModel(
              null,
              ResponseMessages.SERVICE_UNAVAILABLE.code,
              ResponseMessages.SERVICE_UNAVAILABLE.message,
            ),
          );
      }
    }

    Logger.error(
      `${this.logNameSpace}.internalServerError`,
      '',
      exception as object,
    );

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseModel(
          null,
          ResponseMessages.SERVER_ERROR.code,
          ResponseMessages.SERVER_ERROR.message,
        ),
      );
  }
}
