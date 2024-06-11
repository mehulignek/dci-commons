import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http.exception';

export class CustomBadRequestExceptionNew extends CustomHttpException {
  constructor(
    public logNameSpace: string,
    public message: string,
    public errorCode?: string,
    public data?: any,
  ) {
    super(message, HttpStatus.BAD_REQUEST, data, logNameSpace, errorCode);
  }
}
