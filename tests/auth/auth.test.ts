
/**
 * @file tests/auth/auth.test.ts
 * 
 * Standard Jest tests for JsonWebTokenUtil.
 */

import { JsonWebTokenUtil } from '../../app/auth/jwt.util';

describe('JsonWebTokenUtil', () => {
  const payload = { sub: 'user-123', username: 'admin' };
  const SECRET = 'test-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  describe('generateTokenPair', () => {
    it('should generate valid access and refresh tokens (GMMTOD-5-AC1)', () => {
      const tokens = JsonWebTokenUtil.generateTokenPair(payload);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      
      const decodedAccess = JsonWebTokenUtil.verifyToken(tokens.accessToken);
      const decodedRefresh = JsonWebTokenUtil.verifyToken(tokens.refreshToken);
      
      expect(decodedAccess.sub).toBe(payload.sub);
      expect(decodedRefresh.sub).toBe(payload.sub);
    });

    it('should have correct expiration for access token (GMMTOD-5-AC2)', () => {
        const tokens = JsonWebTokenUtil.generateTokenPair(payload);
        const decoded = JsonWebTokenUtil.decodeToken(tokens.accessToken);
        const now = Math.floor(Date.now() / 1000);
        // 15 minutes = 900 seconds. We check it's within a reasonable window.
        expect(decoded.exp).toBeGreaterThan(now);
        expect(decoded.exp).toBeLessThanOrEqual(now + 900 + 10); 
    });

    it('should have correct expiration for refresh token (GMMTOD-5-AC3)', () => {
        const tokens = JsonWebTokenUtil.generateTokenPair(payload);
        const decoded = JsonWebTokenUtil.decodeToken(tokens.refreshToken);
        const now = Math.floor(Date.now() / 1000);
        // 7 days = 604800 seconds.
        expect(decoded.exp).toBeGreaterThan(now);
        expect(decoded.exp).toBeLessThanOrEqual(now + 604800 + 10);
    });
  });

  describe('verifyToken', () => {
    it('should return valid payload for correct token (GMMTOD-9-AC3)', () => {
      const tokens = JsonWebTokenUtil.generateTokenPair(payload);
      const decoded = JsonWebTokenUtil.verifyToken(tokens.accessToken);
      expect(decoded.sub).toBe(payload.sub);
    });

    it('should throw error for invalid token (GMMTOD-9-AC1)', () => {
      const invalidToken = 'not.a.real.token';
      expect(() => JsonWebTokenUtil.verifyToken(invalidToken)).toThrow();
    });

    it('should throw error if JWT_SECRET is missing (GMMTOD-9-AC2)', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      expect(() => JsonWebTokenUtil.verifyToken('some-token')).toThrow('JWT_SECRET environment variable is not set');
      process.env.JWT_SECRET = originalSecret;
    });
  });

  describe('decodeToken', () => {
    it('should return decoded payload (GMMTOD-9-AC3)', () => {
      const tokens = JsonWebTokenUtil.generateTokenPair(payload);
      const decoded = JsonWebTokenUtil.decodeToken(tokens.accessToken);
      expect(decoded.sub).toBe(payload.sub);
    });
  });
});

