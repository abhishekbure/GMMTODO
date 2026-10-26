
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export class JwtUtil {
  private static readonly ACCESS_TOKEN_TTL = '15m';
  private static readonly REFRESH_TOKEN_TTL = '7d';
  private static readonly SECRET = process.env.JWT_SECRET;

  static generateTokenPair(payload: any): TokenPair {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const accessToken = jwt.sign(payload, this.SECRET, { expiresIn: this.ACCESS_TOKEN_TTL });
    const refreshToken = jwt.sign(payload, this.SECRET, { expiresIn: this.REFRESH_TOKEN_TTL });
    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): any {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.verify(token, this.SECRET);
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
