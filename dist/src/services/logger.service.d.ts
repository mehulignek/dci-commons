/// <reference types="express" />
declare class AppLogger {
    private logger;
    constructor();
    info(namespace: string, meta?: object): void;
    error(namespace: string, error: object | string, meta?: string | object): void;
    warn(namespace: string, meta?: object | string): void;
    debug(namespace: string, meta?: object | string): void;
    log(message: any, namespace: string): void;
}
export declare const Logger: AppLogger;
export declare const ApiLoggerMiddleware: import("express").Handler;
export declare function getMobileNumberFromJwtToken(token: string): any;
export {};
