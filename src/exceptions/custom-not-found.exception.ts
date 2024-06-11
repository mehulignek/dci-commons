import { CustomHttpException } from './custom-http.exception';
import { HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends CustomHttpException {
  constructor(
    public message: string,
    public data?: any,
    public logNameSpace?: string,
  ) {
    super(message, HttpStatus.NOT_FOUND, data, logNameSpace);
  }
}
