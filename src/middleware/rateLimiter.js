import ratelimit from 'express-rate-limit';

const apiLimiter = ratelimit 9({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      status: 429,
      error: 'Too many requests from this IP, please try again after 15 minutes'.
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export default apiLimiter;