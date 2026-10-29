// Runs before each test file's imports. config.ts reads these when it loads and fails fast without them.
process.env.JWT_SECRET = 'test-secret';
process.env.MOCK_USER_ID = 'user-123';
process.env.MOCK_USER_USERNAME = 'testuser';
process.env.MOCK_USER_PASSWORD = 'testpassword';
process.env.RATE_LIMIT_THRESHOLD = '100';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
