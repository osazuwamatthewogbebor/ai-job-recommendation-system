import express from 'express';
import APP_CONFIG from './config/APP_CONFIG.js';
import logger from './config/logger.js';
import sequelize from './config/sequelize.js';
import uploadRoutes from './routes/uploadRoutes.js'; 
import apiLimiter from "./middleware/rateLimiter.js";
import jobRoute from './routes/jobRoutes.js';


const app = express();

const port = APP_CONFIG.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Apply the rate limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the AI Job Recommendation System API');
});

// Sync database 
sequelize.sync()
    .then(() => {
        logger.info('Database synchronized successfully');
    })
    .catch((error) => {
        logger.error('Error synchronizing database:', error);
    });

app.use('/api/recommend', jobRoute);

app.listen(port, () => { 
    logger.info(`Server is running on port ${port}`)
;});