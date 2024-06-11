import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { CustomHttpException } from '../exceptions/custom-http.exception';
export declare class CustomHttpExceptionFilter implements ExceptionFilter {
    catch(exception: CustomHttpException, host: ArgumentsHost): void;
}
