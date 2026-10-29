
import { config } from '../config/config';

const ipCache = new Map<string, { count: number; resetTime: number }>();
const LIMIT = config.rateLimit.threshold;
const WINDOW_MS = config.rateLimit.windowMs;

export function rateLimiter(req: any, res: any, next: any): void {
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
