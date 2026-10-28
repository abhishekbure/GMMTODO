export const config = {
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
    threshold: parseInt(process.env.RATE_LIMIT_THRESHOLD as string, 10) || 10,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS as string, 10) || 60000,
  },
};

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is not configured');
}

if (!config.auth.mockUser.id || !config.auth.mockUser.username || !config.auth.mockUser.password) {
  throw new Error('MOCK_USER credentials are not configured');
}
