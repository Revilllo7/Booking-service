"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/health', (req, res) => res.send('OK'));
router.get('/', auth_1.authenticate, bookingController_1.getAllBookings);
router.get('/:id', auth_1.authenticate, bookingController_1.getBookingById);
router.post('/', auth_1.authenticate, bookingController_1.createBooking);
router.put('/:id', auth_1.authenticate, bookingController_1.updateBooking);
router.delete('/:id', auth_1.authenticate, bookingController_1.deleteBooking);
exports.default = router;
