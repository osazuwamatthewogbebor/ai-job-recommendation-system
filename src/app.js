import express from 'express';
import APP_CONFIG from './config/APP_CONFIG.js';
import AppError from './utils/AppError.js';
//import logger from './config/logger.js';
import jobRoute from './routes/jobRoutes.js';
import { recommendJobs } from './controllers/jobControllers.js';

const port = APP_CONFIG.PORT;
// All env and configuration files can be gotten from APP_CONFIG
// when you add sth to .env, also put in APP_CONFIG
// This ensures we have all credentials in one source of truth

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', jobRoute);

app.get('/', (req, res) => {
  res.send('AI Job Recommendation API is running...');
});



app.listen(port, () => {
    // We will use pino logger here, anywhere we are supposed to use console.log
    // console log for now till it is configured on it
    // console.log(`Server is running on port ${port}`);
    // Pino in use after configuring

    //logger.info(`Server is running on port ${port}`)


    // this how to use the custom Error class instead of the default error class
    // throw new AppError(`Testing the custom error class`, 401)
    // whenever you need throw new Error(), use the AppError instead
    // It takes the message and statusCode making it more precise than the default new Error
;});