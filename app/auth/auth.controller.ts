import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokenPair } from './jwt.util';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    const username = req.body.username;
    const password = req.body.password;

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

    try {
      const tokens = await this.authService.refresh(refreshToken);
      res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json(tokens);
    } catch (error) {
      res.status(403).json({ message: 'Forbidden' });
    }
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
