// Redis configuration
import { createClient } from "redis";
import APP_CONFIG from "./APP_CONFIG";
import logger from "./logger";

export const redisClient = async () => {
    // Credentials from redis cloud
    const client = createClient({
        username: APP_CONFIG.REDIS_USERNAME,
        password: APP_CONFIG.REDIS_PASSWORD,
        socket: {
            host: APP_CONFIG.REDIS_HOST,
            port: APP_CONFIG.REDIS_PORT
        },
    });

    client.on('error', err => logger.error(`Redis Client Error: ${err}`));
    await client.connect();
    logger.info("Redis db ready to receive cache data!")
};