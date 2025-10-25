import { redisClient } from "../config/cache";
import logger from "../config/logger";

class CacheManager {
    constructor() {
        this.redis = redisClient(); 
    };

    // add data to redis cache
    async setCache(key, value, ttl = null) {
        logger.info(`Adding ${key} to cache...`)

        const data = JSON.stringify(value);
        
        if (ttl) {
            await this.redis.set(key, data, { EX: ttl, NX: true });
        } else {
            await this.redis.set(key, data);
        };
        logger.info(`${key} cached successfully.`);
        
        return;
    };

    // retrieve data from redis cache
    async getCache(key) {
        const data = await this.redis.get(key);
        if (data) {
            logger.info(`${key} retrieved from cache successfully.`);
            return data;
        };

        return null;
    };

    // delete a specific keyfrom redis cache
    async delCache(key) {
        await this.redis.del(key);
        logger.info(`Key ${key} deleted from cache.`);
        return;
    };

    // clear all cache from redis
    async flushAllCache() {
        await this.redis.flushall();
        logger.info("Cache cleared.");
        return;
    };

    // use cache if available, else call fetch function and set cache
    async getFetchSetCache(key, fetchFn, ttl = null) {
        const cached = await this.getCache(key);
        if (cached) {
            logger.info(`Cache Hit for key ${key}`);
            return cached;
        } else {
            logger.info(`Cache miss for key ${key}. \nCalling API...`);
            const freshData = await fetchFn();

            // setting to cache
            await this.setCache(key, freshData, ttl);
            return freshData;
        };
    };
};

export default new CacheManager();