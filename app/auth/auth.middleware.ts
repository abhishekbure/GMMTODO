
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenUtil } from './jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = JsonWebTokenUtil.verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
