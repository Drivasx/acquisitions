import { slidingWindow } from "@arcjet/node";
import aj from "../config/arcjet.js";
import logger from "../config/logger.js";

const securityMiddleware = async (req, res, next) => {
    try {
        const role = req.user?.role || 'guest';

        let limit;
        let message;

        switch (role) {
            case 'admin':
                limit = 20; // 20 requests per minute for admin
                message = 'Rate limit exceeded for admin';
            break;
            case 'user':
                limit = 10; // 10 requests per minute for user
                message = 'Rate limit exceeded for user';
            break;
            case 'guest':
            default:
                limit = 5; // 5 requests per minute for guest
                message = 'Rate limit exceeded for guest';
            break;
        }

        const client = aj.withRule(slidingWindow({
            mode: "LIVE",
            interval: '1m',
            max: limit,
            name: `${role}-rate-limit`
        }));

        const decision = await client.protect(req);

        if(decision.isDenied && decision.reason.isBot()) {
            logger.warn(`Bot request blocked:`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });
            return res.status(403).json({ error: 'Forbidden', message: 'Access denied: Bot requests are not allowed' });
        }

        if(decision.isDenied && decision.reason.isShield()) {
            logger.warn(`Shield request blocked:`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path,
                method: req.method,
            });
            return res.status(403).json({ error: 'Forbidden', message: 'Access denied: Shield requests are not allowed' });
        }

        if(decision.isDenied && decision.reason.isRateLimit()) {
            logger.warn(`Rate limit exceeded:`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path,
                method: req.method,
            });
            return res.status(429).json({ error: 'Too Many Requests', message });
        }
        
        next();
    }   
    catch (error) {
        console.error('Arcjet middleware error', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong with security middleware' });
    }
};

export default securityMiddleware;