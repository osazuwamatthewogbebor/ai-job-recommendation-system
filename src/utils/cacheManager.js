import { initRedis } from "../config/cache.js";
import logger from "../config/logger.js";

class CacheManager {
    constructor() {
        this.redis = null;
    };

    async connect() { 
        if (!this.redis) {
            this.redis = await initRedis();
        };
    };

    // get keys from redis
    async getKeys(pattern) {
        await this.connect();
        return await this.redis.keys(pattern);
    };

    // add data to redis cache
    async setCache(key, value, ttl = null) {
        await this.connect();

        const data = JSON.stringify(value);
        logger.info(`Caching key: ${key}`);
        
        if (ttl) {
            await this.redis.set(key, data, { EX: ttl, NX: true });
        } else {
            await this.redis.set(key, data);
        };
        logger.info(`Cache set for key: ${key}`);
        
        return;
    };

    // retrieve data from redis cache
    async getCache(key) {
        await this.connect();

        const data = await this.redis.get(key);
        if (data) {
            logger.info(`Cache hit for key: ${key}`);
            return JSON.parse(data);
        };

        logger.info(`Cache miss for key: ${key}`);
        return null;
    };

    // delete a specific key from redis cache
    async delCache(key) {
        await this.connect();

        await this.redis.del(key);
        logger.info(`Cache deleted for key: ${key}`);
    };

    // Get cache if available, else, call fetch function and set cache
    async getFetchSetCache(key, fetchFn, ttl = null) {
        const cachedData = await this.getCache(key);

        if (cachedData) return cachedData;
        
        const freshData = await fetchFn();
        await this.setCache(key, freshData, ttl);
        return freshData;
    };

};


export default new CacheManager();