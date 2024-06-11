import { Lock } from 'redlock';
declare class RedisServiceImpl {
    private redisClient;
    private redlock;
    getClient(): Promise<any>;
    setKey(name: string, value: string, expireInSeconds?: number): Promise<any>;
    getKey(name: string): Promise<any>;
    acquireLockOnKey(name: string, duration: number): Promise<Lock>;
    releaseLock(lock: Lock): Promise<void>;
    private getKeyWithEnvPrefix;
    delKey(name: string): Promise<any>;
    generateSequentialId(prefix?: string, start?: number): Promise<string>;
    incrementRedisCounter(key: string, expiryTime: number, limit: number): Promise<boolean>;
    private defineIncrementCounterCommand;
}
export declare const RedisService: RedisServiceImpl;
export {};
