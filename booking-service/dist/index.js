"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const booking_1 = __importDefault(require("./routes/booking"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Simple request logger for healthcheck/debug
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/bookings', booking_1.default);
// Healthcheck endpoint
app.get('/health', (req, res) => res.send('OK'));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Booking service running on port ${PORT}`);
});
