
import { Request, Response } from 'express';
import { JwtUtil, TokenPair } from './jwt.util';

export class AuthService {
  async authenticate(username: string, password: string): Promise<TokenPair | null> {
    const { MOCK_USER_ID, MOCK_USER_USERNAME, MOCK_USER_PASSWORD } = process.env;

    if (!MOCK_USER_ID || !MOCK_USER_USERNAME || !MOCK_USER_PASSWORD) {
      throw new Error('MOCK_USER credentials not configured in environment');
    }

    if (username === MOCK_USER_USERNAME && password === MOCK_USER_PASSWORD) {
      return JwtUtil.generateTokenPair({ sub: MOCK_USER_ID, username: MOCK_USER_USERNAME });
    }
    return null;
  }

  async refresh(refreshToken: string): Promise<TokenPair | null> {
    const decoded = JwtUtil.verifyToken(refreshToken);
    if (!decoded) {
      return null;
    }
    return JwtUtil.generateTokenPair({ sub: decoded.sub, username: decoded.username });
  }

  /**
   * Invalidates the refresh token to log the user out.
   * @param refreshToken The refresh token to be invalidated.
   */
  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, this would invalidate the refresh token in a store (e.g. Redis)
  }
}
