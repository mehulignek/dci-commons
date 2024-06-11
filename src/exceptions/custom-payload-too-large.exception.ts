import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http.exception';

export class CustomPayloadTooLarge extends CustomHttpException {
  constructor(
    public message: string,
    public data?: any,
    public logNameSpace?: string,
  ) {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE, data, logNameSpace);
  }
}
