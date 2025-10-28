// Redis configuration
import { createClient } from "redis";
import APP_CONFIG from "./APP_CONFIG.js";
import logger from "./logger.js";

let client;

export const initRedis = async () => {
    if (client && client.isOpen) return client;

    // Credentials from redis cloud
    client = createClient({ 
        url: `redis://${APP_CONFIG.REDIS_USERNAME}:${APP_CONFIG.REDIS_PASSWORD}@${APP_CONFIG.REDIS_HOST}:${APP_CONFIG.REDIS_PORT}` 
    });

    client.on('error', (err) => logger.error(`Redis Client Error: ${err}`));
    client.on('connect', () => logger.info("Connecting to Redis..."));
    client.on('ready', () => logger.info("Redis connection is ready!"));

    await client.connect();
    return client;
};
