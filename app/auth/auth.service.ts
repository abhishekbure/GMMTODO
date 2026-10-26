
import { Request, Response } from 'express';
import { JwtUtil, TokenPair } from './jwt.util';

export class AuthService {
  async authenticate(username: string, password: string): Promise<TokenPair | null> {
    // In a real implementation, this would query the database
    const mockUserId = process.env.MOCK_USER_ID;
    const mockUsername = process.env.MOCK_USER_USERNAME;
    const mockPassword = process.env.MOCK_USER_PASSWORD;

    if (!mockUserId || !mockUsername || !mockPassword) {
      throw new Error('MOCK_USER credentials not configured in environment');
    }

    if (username === mockUsername && password === mockPassword) {
      return JwtUtil.generateTokenPair({ sub: mockUserId, username: mockUsername });
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
