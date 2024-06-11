"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessages = void 0;
class ResponseMessages {
}
exports.ResponseMessages = ResponseMessages;
ResponseMessages.SUCCESS = {
    code: 'SUCCESS',
    message: 'Success',
};
ResponseMessages.SERVER_ERROR = {
    code: 'ERR_SERVER_ERROR',
    message: 'Some error happened on the server, please try again later',
};
ResponseMessages.NOT_FOUND = {
    code: 'NOT_FOUND',
    message: 'Not found',
};
ResponseMessages.INVALID_REQUEST_PAYLOAD = {
    code: 'INVALID_REQUEST_PAYLOAD',
    message: 'Request payload is invalid',
};
ResponseMessages.SERVICE_UNAVAILABLE = {
    code: 'ERR_SERVICE_UNAVAILABLE',
    message: 'Service unavailable',
};
ResponseMessages.PAYMENT_REQUIRED = {
    code: 'ERR_PAYMENT_REQUIRED',
    message: 'Service unavailable.',
};
//# sourceMappingURL=response-messages.constants.js.map