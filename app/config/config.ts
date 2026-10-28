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
    threshold: (() => {
      const val = process.env.RATE_LIMIT_THRESHOLD;
      if (val === undefined || isNaN(parseInt(val, 10))) {
        throw new Error('RATE_LIMIT_THRESHOLD environment variable is not a valid number');
      }
      return parseInt(val, 10);
    })(),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS as string, 10) || 60000,
  },
};

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is not configured');
}

if (!config.auth.mockUser.id || !config.auth.mockUser.username || !config.auth.mockUser.password) {
  throw new Error('MOCK_USER credentials are not configured');
}
