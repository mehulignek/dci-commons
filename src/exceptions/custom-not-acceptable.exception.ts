import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http.exception';

export class CustomNotAcceptable extends CustomHttpException {
  constructor(
    public message: string,
    public data?: any,
    public logNameSpace?: string,
  ) {
    super(message, HttpStatus.NOT_ACCEPTABLE, data, logNameSpace);
  }
}
