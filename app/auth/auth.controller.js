"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async login(req, res) {
        const { username, password } = req.body;
        const tokens = await this.authService.authenticate(username, password);
        if (!tokens) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json(tokens);
    }
    async refresh(req, res) {
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
        }
        catch (error) {
            res.status(403).json({ message: 'Forbidden' });
        }
    }
    async logout(req, res) {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(204).send();
    }
}
exports.AuthController = AuthController;
