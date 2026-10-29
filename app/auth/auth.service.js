"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_util_1 = require("./jwt.util");
const config_1 = require("../config/config");
class AuthService {
    async authenticate(username, password) {
        const { id, username: mockUsername, password: mockPassword } = config_1.config.auth.mockUser;
        if (username === mockUsername && password === mockPassword) {
            return jwt_util_1.JsonWebTokenUtil.generateTokenPair({ sub: id, username: mockUsername });
        }
        return null;
    }
    async refresh(refreshToken) {
        try {
            const decoded = jwt_util_1.JsonWebTokenUtil.verifyToken(refreshToken);
            if (!decoded) {
                throw new Error('Invalid token payload');
            }
            return jwt_util_1.JsonWebTokenUtil.generateTokenPair({ sub: decoded.sub, username: decoded.username });
        }
        catch (error) {
            console.error('Token refresh failed:', error instanceof Error ? error.message : error);
            throw error;
        }
    }
    /**
     * Invalidates the refresh token to log the user out.
     * @param refreshToken The refresh token to be invalidated.
     */
    async logout(refreshToken) {
        // In a real implementation, this would invalidate the refresh token in a store (e.g. Redis)
    }
}
exports.AuthService = AuthService;
