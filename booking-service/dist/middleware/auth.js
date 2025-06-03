"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }
    try {
        const token = auth.split(' ')[1];
        // @ts-ignore
        req.user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
