
import * as jwt from 'jsonwebtoken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export class JsonWebTokenUtil {
  private static readonly ACCESS_TOKEN_TTL = '15m';
  private static readonly REFRESH_TOKEN_TTL = '7d';

  private static get secret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
  }

  static generateTokenPair(payload: any): TokenPair {
    const accessToken = jwt.sign(payload, this.secret, { expiresIn: this.ACCESS_TOKEN_TTL });
    const refreshToken = jwt.sign(payload, this.secret, { expiresIn: this.REFRESH_TOKEN_TTL });
    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, this.secret);
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
