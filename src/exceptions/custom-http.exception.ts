import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    public message: string,
    public httpCode: HttpStatus,
    public data?: any,
    public logNameSpace?: string,
    public errorCode?: string,
  ) {
    super(message, httpCode);
  }
}
