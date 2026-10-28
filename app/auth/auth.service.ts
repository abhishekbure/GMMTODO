
import { JwtUtil, TokenPair } from './jwt.util';
import { config } from '../config/config';

export class AuthService {
  async authenticate(username: string, password: string): Promise<TokenPair | null> {
    const { id, username: mockUsername, password: mockPassword } = config.auth.mockUser;

    if (username === mockUsername && password === mockPassword) {
      return JwtUtil.generateTokenPair({ sub: id, username: mockUsername });
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
