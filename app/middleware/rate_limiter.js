"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
const config_1 = require("../config/config");
const ipCache = new Map();
const LIMIT = config_1.config.rateLimit.threshold;
const WINDOW_MS = config_1.config.rateLimit.windowMs;
function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const record = ipCache.get(ip);
    if (!record || now > record.resetTime) {
        ipCache.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        next();
        return;
    }
    if (record.count >= LIMIT) {
        res.status(429).json({ message: 'Too many requests, please try again later.' });
        return;
    }
    record.count++;
    next();
}
