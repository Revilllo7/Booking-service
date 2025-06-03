"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBooking = exports.getBookingById = exports.getAvailableSlots = exports.getAllBookings = exports.createBooking = void 0;
// Updated bookingController.ts
const client_1 = require("@prisma/client");
const booking_db_1 = require("../booking-db");
const prisma = new client_1.PrismaClient();
const AVAILABLE_HOURS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];
// Create a booking
const createBooking = async (req, res) => {
    // Accept both userId from body or from JWT (if you add auth later)
    const { userId, service, date, time } = req.body;
    if (!userId || !service || !date || !time) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }
    try {
        // Check for slot conflict
        const conflict = await prisma.booking.findFirst({
            where: {
                date: new Date(date),
                time: time,
            },
        });
        if (conflict) {
            res.status(409).json({ error: "Slot already taken" });
            return;
        }
        const booking = await prisma.booking.create({
            data: {
                userId,
                service,
                date: new Date(date),
                time,
            },
        });
        res.status(201).json(booking);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating booking" });
    }
};
exports.createBooking = createBooking;
// Get all bookings (raw SQL, for compatibility with your DB schema)
const getAllBookings = async (_req, res) => {
    try {
        const result = await booking_db_1.pool.query('SELECT * FROM bookings ORDER BY date, time');
        res.json(result.rows);
    }
    catch (err) {
        console.log("DB Error:", err);
        res.status(500).json({ error: 'Error fetching bookings' });
    }
};
exports.getAllBookings = getAllBookings;
// Get available slots for a date
const getAvailableSlots = async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== "string") {
        res.status(400).json({ error: "Missing date" });
        return;
    }
    try {
        const bookings = await prisma.booking.findMany({
            where: { date: new Date(date) },
            select: { time: true },
        });
        const booked = bookings.map((b) => b.time.slice(0, 5));
        const available = AVAILABLE_HOURS.filter((t) => !booked.includes(t));
        res.json({ available });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch slots" });
    }
};
exports.getAvailableSlots = getAvailableSlots;
// Get a single booking by ID
const getBookingById = async (req, res) => {
    const bookingId = Number(req.params.id);
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });
        if (!booking)
            return res.status(404).json({ error: "Not found" });
        res.json(booking);
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching booking" });
    }
};
exports.getBookingById = getBookingById;
// Update a booking by ID
const updateBooking = async (req, res) => {
    const bookingId = Number(req.params.id);
    const { service, date, time } = req.body;
    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            return res.status(404).json({ error: "Not found" });
        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                service,
                date: new Date(date),
                time,
            }
        });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: "Error updating booking" });
    }
};
exports.updateBooking = updateBooking;
// Delete a booking by ID
const deleteBooking = async (req, res) => {
    const bookingId = Number(req.params.id);
    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            return res.status(404).json({ error: "Not found" });
        await prisma.booking.delete({ where: { id: bookingId } });
        res.json({ message: "Booking deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Error deleting booking" });
    }
};
exports.deleteBooking = deleteBooking;
