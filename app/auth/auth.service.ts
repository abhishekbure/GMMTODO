
import { Request, Response } from 'express';
import { JwtUtil, TokenPair } from './jwt.util';

// Mocking a user database for implementation
const MOCK_USER = {
  id: 'user-123',
  username: 'admin',
  password: 'password123'
};

export class AuthService {
  async authenticate(username: string, password: string): Promise<TokenPair | null> {
    // In a real implementation, this would query the database
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      return JwtUtil.generateTokenPair({ sub: MOCK_USER.id, username: MOCK_USER.username });
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

  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, this would invalidate the refresh token in a store (e.g. Redis)
    console.log(`Logging out token: ${refreshToken}`);
  }
}

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const tokens = await this.authService.authenticate(username, password);

    if (!tokens) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json(tokens);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const tokens = await this.authService.refresh(refreshToken);

    if (!tokens) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json(tokens);
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(204).send();
  }
}
