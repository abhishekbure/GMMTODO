
/**
 * @file tests/auth/auth.test.ts
 * 
 * Standard Jest tests for JwtUtil.
 */

import { JwtUtil } from '../../app/auth/jwt.util';

describe('JwtUtil', () => {
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
      const tokens = JwtUtil.generateTokenPair(payload);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      
      const decodedAccess = JwtUtil.verifyToken(tokens.accessToken);
      const decodedRefresh = JwtUtil.verifyToken(tokens.refreshToken);
      
      expect(decodedAccess.sub).toBe(payload.sub);
      expect(decodedRefresh.sub).toBe(payload.sub);
    });
  });

  describe('verifyToken', () => {
    it('should return valid payload for correct token (GMMTOD-9-AC3)', () => {
      const tokens = JwtUtil.generateTokenPair(payload);
      const decoded = JwtUtil.verifyToken(tokens.accessToken);
      expect(decoded.sub).toBe(payload.sub);
    });

    it('should return null/throw for invalid token (GMMTOD-9-AC1)', () => {
      const invalidToken = 'not.a.real.token';
      expect(() => JwtUtil.verifyToken(invalidToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should return decoded payload (GMMTOD-9-AC3)', () => {
      const tokens = JwtUtil.generateTokenPair(payload);
      const decoded = JwtUtil.decodeToken(tokens.accessToken);
      expect(decoded.sub).toBe(payload.sub);
    });
  });
});

