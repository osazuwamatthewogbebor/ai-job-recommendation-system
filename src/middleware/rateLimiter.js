import ratelimit from 'express-rate-limit';

const apiLimiter = ratelimit ({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
      status: 429,
      error: 'Too many requests from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true, 
    legacyHeaders: false,
});


export default apiLimiter;