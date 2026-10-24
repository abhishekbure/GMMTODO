
import { Request, Response, NextFunction } from 'express';

const ipCache = new Map<string, { count: number; resetTime: number }>();
const LIMIT = 10;
const WINDOW_MS = 60000; // 1 minute

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
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
