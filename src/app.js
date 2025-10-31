import express from 'express';

import APP_CONFIG from './config/APP_CONFIG.js';
import logger from './config/logger.js';
import sequelize from './config/sequelize.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import apiLimiter from "./middleware/rateLimiter.js";

import { authRoutes, profileRoutes, uploadRoutes, jobRoutes, adminRoutes } from './routes/index.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initRedis } from './config/cache.js';
import { authorizeAdmin } from './middleware/authorizeAdmin.js';


const app = express();
const port = APP_CONFIG.PORT;

// Security setup
app.use(helmet());
app.use(cors());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("../uploads"));

// Apply the rate limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the AI Job Recommendation System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/uploads', authMiddleware, uploadRoutes);
app.use('/api/recommend', authMiddleware, jobRoutes);
app.use('/admin', authMiddleware, authorizeAdmin, adminRoutes);


// Error handlers

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Connecting to Redis
(async () => {
    try {
        await initRedis();
        logger.info("Redis ssuccessufully initialised.")
    } catch (error) {
        logger.error(`Failed to connect to Redis: ${error.message}`)
    };
})();

// Sync database 
sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully');
        app.listen(port, () => { 
          logger.info(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        logger.error({ err: error }, 'Error synchronizing database:');
        process.exit(1);
    });
