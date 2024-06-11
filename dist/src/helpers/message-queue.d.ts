export declare const init: (msName: string, hostName: string, connectionURL: string) => void;
export declare const publish: (unused: any, queueName: string, content: any, callback: (err: any, result?: boolean) => void) => void;
export declare const subscribe: (unused: any, queueName: string, callback: (err: any, message?: any) => void) => void;
