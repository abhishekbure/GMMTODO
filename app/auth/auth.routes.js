"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const rate_limiter_1 = require("../middleware/rate_limiter");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Apply rate limiter to login and refresh endpoints
router.post('/login', (req, res, next) => {
    (0, rate_limiter_1.rateLimiter)(req, res, () => {
        authController.login(req, res).catch(next);
    });
});
router.post('/refresh', (req, res, next) => {
    (0, rate_limiter_1.rateLimiter)(req, res, () => {
        authController.refresh(req, res).catch(next);
    });
});
router.post('/logout', (req, res, next) => {
    authController.logout(req, res).catch(next);
});
exports.default = router;
