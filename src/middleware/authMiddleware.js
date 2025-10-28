import jwt from 'jsonwebtoken';
import APP_CONFIG from '../config/APP_CONFIG.js';
import logger from '../config/logger.js';

export const authMiddleware = (req, res, next) => {
    try {

        const token = req.cookies["token"];

        if (!token) {
            logger.warn("Access denied: No Auth token provided.");
            return res.status(401).json({ success: false, message: "Access denied. No token provided."});
        };

        const decoded = jwt.verify(token, APP_CONFIG.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        logger.error(`JWT verification failed: ${error.message}`);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired." });
        };

        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ success: false, message: "Invalid token." });
        };

        return res.status(500).json({ success: false, message: "Authentication"});
    };
    
};


export const verifyAccountMiddleware = (req, res, next) => {
    try {

        const token = req.cookies["token"];

        if (!token) {
            logger.warn("Access denied: No Auth token provided. Please Sign Up.");
            return res.status(401).json({ success: false, message: "Access denied. No token provided. Please Sign Up / Log in."});
        };

        const decoded = jwt.verify(token, APP_CONFIG.JWT_OTP_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        logger.error(`JWT verification failed: ${error.message}`);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired." });
        };

        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ success: false, message: "Invalid token." });
        };

        return res.status(500).json({ success: false, message: "Authentication"});
    };
    
};