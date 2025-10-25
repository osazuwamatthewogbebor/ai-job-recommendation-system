import express from 'express';

import APP_CONFIG from './config/APP_CONFIG.js';
import logger from './config/logger.js';
import pinoHttp from 'pino-http';
import sequelize from './config/sequelize.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import apiLimiter from "./middleware/rateLimiter.js";

import { authRoutes, profileRoutes, uploadRoutes, jobRoutes } from './routes/index.js';
import { authMiddleware } from './middleware/authMiddleware.js';


const app = express();
const port = APP_CONFIG.PORT;

// http request logger
app.use(
    pinoHttp({
        logger,
        autoLogging: true,
        customLogLevel: (res, err) => {
            if (res.statusCode >= 500 || err) return 'error';
            if (res.statusCode >= 400) return 'warn';
            return 'info';
        },
        customSuccessMessage: (res) => {
            return `${res.req.method} ${res.req.url} -> ${res.statusCode}`;
        },
    })
);

// Security setup
app.use(helmet());
app.use(cors());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Apply the rate limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the AI Job Recommendation System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
// app.use('/api/uploads', uploadRoutes);
app.use('/api/recommend', authMiddleware, jobRoutes);


// Sync database 
sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully');
        app.listen(port, () => { 
          logger.info(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        logger.error('Error synchronizing database:', error);
        process.exit(1);
    });
