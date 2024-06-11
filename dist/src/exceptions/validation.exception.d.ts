import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
declare class ValidationException extends BadRequestException {
    readonly validationErrors?: ValidationError[];
    constructor(validationErrors?: ValidationError[]);
    getErrorMessage(): string;
    private formatErrors;
}
export { ValidationException };
