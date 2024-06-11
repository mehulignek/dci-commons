import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class UnhandledExceptionFilter implements ExceptionFilter {
    private logNameSpace;
    catch(exception: any, host: ArgumentsHost): any;
}
