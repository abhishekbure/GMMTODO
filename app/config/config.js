"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    jwt: {
        secret: process.env.JWT_SECRET || '',
    },
    auth: {
        mockUser: {
            id: process.env.MOCK_USER_ID || '',
            username: process.env.MOCK_USER_USERNAME || '',
            password: process.env.MOCK_USER_PASSWORD || '',
        },
    },
    rateLimit: {
        threshold: (() => {
            const val = process.env.RATE_LIMIT_THRESHOLD;
            if (val === undefined || isNaN(parseInt(val, 10))) {
                throw new Error('RATE_LIMIT_THRESHOLD environment variable is not a valid number');
            }
            return parseInt(val, 10);
        })(),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    },
};
if (!exports.config.jwt.secret) {
    throw new Error('JWT_SECRET is not configured');
}
if (!exports.config.auth.mockUser.id || !exports.config.auth.mockUser.username || !exports.config.auth.mockUser.password) {
    throw new Error('MOCK_USER credentials are not configured');
}
