import { Router } from 'express';
import { AuthController } from './auth.controller';
import { rateLimiter } from '../middleware/rate_limiter';

const router = Router();
const authController = new AuthController();

// Apply rate limiter to login and refresh endpoints
router.post('/login', (req, res, next) => {
  rateLimiter(req, res, () => {
    authController.login(req, res).catch(next);
  });
});

router.post('/refresh', (req, res, next) => {
  rateLimiter(req, res, () => {
    authController.refresh(req, res).catch(next);
  });
});

router.post('/logout', (req, res, next) => {
  authController.logout(req, res).catch(next);
});

export default router;
