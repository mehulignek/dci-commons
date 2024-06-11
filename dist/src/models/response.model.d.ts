export declare class ResponseModel {
    code: string | number;
    message: string;
    data?: object[] | object | string;
    constructor(data: object | object[] | string, code: string | number, message?: string);
}
