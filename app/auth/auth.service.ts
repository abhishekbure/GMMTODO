
import { JsonWebTokenUtil, TokenPair } from './jwt.util';
import { config } from '../config/config';

export class AuthService {
  async authenticate(username: string, password: string): Promise<TokenPair | null> {
    const { id, username: mockUsername, password: mockPassword } = config.auth.mockUser;

    if (username === mockUsername && password === mockPassword) {
      return JsonWebTokenUtil.generateTokenPair({ sub: id, username: mockUsername });
    }
    return null;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = JsonWebTokenUtil.verifyToken(refreshToken);
      if (!decoded) {
        const error = new Error('Invalid token payload');
        console.error('Token refresh failed: Invalid payload');
        throw error;
      }
      return JsonWebTokenUtil.generateTokenPair({ sub: decoded.sub, username: decoded.username });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Token refresh failed: ${message}`);
      throw error;
    }
  }

  /**
   * Invalidates the refresh token to log the user out.
   * @param refreshToken The refresh token to be invalidated.
   */
  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, this would invalidate the refresh token in a store (e.g. Redis)
  }
}
