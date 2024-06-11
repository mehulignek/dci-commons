export class ResponseModel {
  code: string | number;
  message: string;
  data?: object[] | object | string;

  constructor(
    data: object | object[] | string,
    code: string | number,
    message?: string,
  ) {
    this.code = code;
    this.message = message || null;
    this.data = data;
  }
}
