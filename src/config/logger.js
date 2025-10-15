// Pino configuration
import pino, { destination } from 'pino';
import path from 'path';
import APP_CONFIG from './APP_CONFIG.js';


const __dirname = import.meta.dirname;
const logPath = path.join(__dirname, '../../app.logs');


const transport = pino.transport({
    targets: [{
        level: APP_CONFIG.PINO_LOG_LEVEL_FILE || 'trace',
        target: 'pino/file',
        options: { destination: logPath },
        
    }, {
        level: APP_CONFIG.PINO_LOG_LEVEL_CONSOLE || 'info',
        target: 'pino-pretty',
        options: { colorize: true },
    }],
})


const logger = pino(
    {timestamp: pino.stdTimeFunctions.isoTime},
    transport
);

export default logger;