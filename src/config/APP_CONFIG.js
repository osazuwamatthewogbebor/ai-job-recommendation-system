// export for all env credentials
import dotenv from 'dotenv';

dotenv.config();

const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    JSEARCH_API_KEY: process.env.JSEARCH_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,

    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_OTP_SECRET: process.env.JWT_OTP_SECRET,
    ACCESS_TOKEN_EXPIRY_TIME: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    VERIFICATION_TOKEN_EXPIRY_TIME: process.env.VERIFICATION_TOKEN_EXPIRY_TIME,

    EMAIL_SERVICE_SMTP_HOST: process.env.EMAIL_SERVICE_SMTP_HOST,
    EMAIL_SERVICE_USER: process.env.EMAIL_SERVICE_USER,
    EMAIL_SERVICE_APP_PASSWORD: process.env.EMAIL_SERVICE_APP_PASSWORD,
    EMAIL_SERVICE_PORT: process.env.EMAIL_SERVICE_PORT,
    OTP_EXPIRY_TIME_MINS: process.env.OTP_EXPIRY_TIME_MINS || 5,
    
    PINO_LOG_LEVEL_CONSOLE: process.env.PINO_LOG_LEVEL_CONSOLE,
    PINO_LOG_LEVEL_FILE: process.env.PINO_LOG_LEVEL_FILE,

    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST, 
    REDIS_PORT: process.env.REDIS_PORT || 17720,

    UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads"
};

let missing = false;

for (let key in APP_CONFIG) {
    if (!APP_CONFIG[key]) {
        missing = true;
        console.error(`${key} is not set in environment variables`);
    };
};

if (!missing) {
    console.log(`All required credentials are present in environment vairiables`);
};

export default APP_CONFIG;
