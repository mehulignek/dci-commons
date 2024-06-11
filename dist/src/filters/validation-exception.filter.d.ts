import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';
export declare class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): void;
}
