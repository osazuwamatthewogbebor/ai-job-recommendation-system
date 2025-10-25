import express from 'express';

import APP_CONFIG from './config/APP_CONFIG.js';
import logger from './config/logger.js';
import sequelize from './config/sequelize.js';

import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import apiLimiter from "./middleware/rateLimiter.js";

import { authRoutes, profileRoutes, uploadRoutes, jobRoutes } from './routes/index.js';


const app = express();

const port = APP_CONFIG.PORT;


// Security setup
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Apply the rate limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the AI Job Recommendation System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/recommend', jobRoutes);


// Sync database 
sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully');
    })
    .catch((error) => {
        logger.error('Error synchronizing database:', error);
    });


app.listen(port, () => { 
    logger.info(`Server is running on port ${port}`)
;});