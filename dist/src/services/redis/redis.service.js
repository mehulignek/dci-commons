"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redlock_1 = require("redlock");
const ioredis_1 = require("ioredis");
const default_1 = require("../../../config/default");
const logger_service_1 = require("../logger.service");
class RedisServiceImpl {
    async getClient() {
        if (this.redisClient) {
            return this.redisClient;
        }
        this.redisClient = await new ioredis_1.Redis(default_1.ENV_PARAMS.redisConnectionString);
        this.redlock = new redlock_1.default([this.redisClient], {
            driftFactor: 0.01,
            retryCount: 0,
        });
        this.defineIncrementCounterCommand();
        return this.redisClient;
    }
    async setKey(name, value, expireInSeconds = null) {
        const client = await this.getClient();
        const key = this.getKeyWithEnvPrefix(name);
        if (expireInSeconds !== null) {
            return client.set(key, value, 'EX', expireInSeconds);
        }
        return client.set(key, value);
    }
    async getKey(name) {
        const client = await this.getClient();
        const key = this.getKeyWithEnvPrefix(name);
        return client.get(key);
    }
    async acquireLockOnKey(name, duration) {
        await this.getClient();
        const key = this.getKeyWithEnvPrefix(name);
        const lock = this.redlock.acquire([key], duration);
        return lock;
    }
    async releaseLock(lock) {
        await lock.release();
    }
    getKeyWithEnvPrefix(name) {
        return `${default_1.ENV_PARAMS.env}-light-api-${name}`;
    }
    async delKey(name) {
        const client = await this.getClient();
        const key = this.getKeyWithEnvPrefix(name);
        return client.del(key);
    }
    async generateSequentialId(prefix = '', start = 0) {
        const redis = await this.getClient();
        try {
            const result = await redis.multi().incr(prefix).exec();
            const newId = result[0][1];
            const nextId = start + newId;
            const sequentialId = prefix + nextId;
            return sequentialId;
        }
        catch (error) {
            logger_service_1.Logger.error(`Error generating sequential ID`, error);
            throw error;
        }
    }
    async incrementRedisCounter(key, expiryTime, limit) {
        try {
            const client = await this.getClient();
            const result = await client.incrementCounter(key, expiryTime.toString(), limit.toString());
            return result === 1;
        }
        catch (error) {
            logger_service_1.Logger.error('Redis.incrementRedisCounter.error', error);
            throw error;
        }
    }
    defineIncrementCounterCommand() {
        this.redisClient.defineCommand('incrementCounter', {
            numberOfKeys: 1,
            lua: `
        local key = KEYS[1]
        local expiryTime = tonumber(ARGV[1])
        local rateLimitCounter = tonumber(ARGV[2])

        local exists = redis.call('EXISTS', key)

        if exists == 1 then
            local incrementedCounter = redis.call('INCR', key)
            if incrementedCounter > rateLimitCounter then
                return false
            else
                return true
            end
        else
            redis.call('SET', key, 1)
            redis.call('EXPIRE', key, expiryTime)
            return true
        end
      `,
        });
    }
}
exports.RedisService = new RedisServiceImpl();
//# sourceMappingURL=redis.service.js.map