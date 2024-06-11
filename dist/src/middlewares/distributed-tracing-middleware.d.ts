import * as cls from 'cls-hooked';
export declare const distributedTracingNamespace: cls.Namespace<Record<string, any>>;
export declare const setTracingId: (tracingId: string) => void;
export declare const getTracingId: () => any;
export declare const DistributedTracingMiddleware: () => (req: any, res: any, next: any) => void;
