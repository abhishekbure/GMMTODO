"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_util_1 = require("./jwt.util");
function authMiddleware(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt_util_1.JsonWebTokenUtil.verifyToken(token);
        if (!decoded) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
}
