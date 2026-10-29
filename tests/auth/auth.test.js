"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../app/index"));
describe('Auth Integration Tests', () => {
    const mockUser = {
        id: 'user-123',
        username: 'testuser',
        password: 'testpassword',
    };
    beforeAll(() => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.MOCK_USER_ID = mockUser.id;
        process.env.MOCK_USER_USERNAME = mockUser.username;
        process.env.MOCK_USER_PASSWORD = mockUser.password;
        process.env.RATE_LIMIT_THRESHOLD = '100';
        process.env.RATE_LIMIT_WINDOW_MS = '60000';
    });
    afterAll(() => {
        delete process.env.JWT_SECRET;
        delete process.env.MOCK_USER_ID;
        delete process.env.MOCK_USER_USERNAME;
        delete process.env.MOCK_USER_PASSWORD;
    });
    describe('POST /api/v1/auth/login', () => {
        it('should return 200 and tokens for valid credentials (GMMTOD-6-AC1)', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/login')
                .send({ username: mockUser.username, password: mockUser.password });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
            // Check cookies
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some(c => c.includes('accessToken'))).toBe(true);
            expect(cookies.some(c => c.includes('refreshToken'))).toBe(true);
        });
        it('should return 401 for invalid credentials (GMMTOD-6-AC3)', async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/login')
                .send({ username: 'wrong', password: 'wrong' });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
    describe('POST /api/v1/auth/refresh', () => {
        it('should return a new TokenPair using a valid RefreshToken (GMMTOD-7-AC1)', async () => {
            // 1. Login to get tokens
            const loginRes = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/login')
                .send({ username: mockUser.username, password: mockUser.password });
            const cookies = loginRes.headers['set-cookie'];
            const refreshTokenCookie = cookies.find(c => c.includes('refreshToken'));
            const refreshToken = refreshTokenCookie?.split(';')[0].split('=')[1];
            expect(refreshToken).toBeDefined();
            // 2. Use refresh token
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/refresh')
                .set('Cookie', [`refreshToken=${refreshToken}`]);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toHaveProperty('refreshToken');
        });
        it('should return 403 for missing refresh token', async () => {
            const res = await (0, supertest_1.default)(index_1.default).post('/api/v1/auth/refresh');
            expect(res.status).toBe(403);
        });
    });
    describe('POST /api/v1/auth/logout', () => {
        it('should clear the session cookies (GMMTOD-8-AC1)', async () => {
            const loginRes = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/login')
                .send({ username: mockUser.username, password: mockUser.password });
            const cookies = loginRes.headers['set-cookie'];
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/v1/auth/logout')
                .set('Cookie', cookies);
            expect(res.status).toBe(204);
        });
    });
});
