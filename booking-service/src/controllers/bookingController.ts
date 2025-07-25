import { PrismaClient } from "@prisma/client";
import { Request, Response, RequestHandler } from "express";
import { pool } from '../booking-db';
import axios from 'axios';


const prisma = new PrismaClient();

const AVAILABLE_HOURS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

// Create a booking
export const createBooking: RequestHandler = async (req, res) => {
  // @ts-ignore
  const userId = req.user?.id;
  // @ts-ignore
  const username = req.user?.preferred_username || req.user?.name || req.user?.email || 'Gość';
  const { service, date, time } = req.body;

  if (!userId || !service || !date || !time) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    const bookingDate = new Date(date);
    const timeDate = new Date(`1970-01-01T${time}:00Z`);

    // Check for slot conflict
    const conflict = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        time: timeDate,
      },
    });

    if (conflict) {
      res.status(409).json({ error: "Slot already taken" });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        username,
        service,
        date: bookingDate,
        time: timeDate,
      },
    });
    res.status(201).json({
      id: booking.id,
      username: booking.username,
      service_type: booking.service,
      date: booking.date,
      time: booking.time,
      createdAt: booking.createdAt,
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// Get all bookings
export const getAllBookings: RequestHandler = async (req, res) => {
  // @ts-ignore
  const { id, role } = req.user;
  try {
    let result;
    if (role === 'admin') {
      result = await pool.query('SELECT id, user_id, username, service_type, date, time, created_at FROM bookings ORDER BY date, time');
    } else {
      result = await pool.query('SELECT id, user_id, username, service_type, date, time, created_at FROM bookings WHERE user_id = $1 ORDER BY date, time', [id]);
    }
    const bookings = result.rows;

    // Use the username
    const bookingsWithUser = bookings.map((b: any) => ({
      id: b.id,
      username: b.username,
      service_type: b.service_type,
      date: b.date,
      time: b.time,
      createdAt: b.created_at,
    }));

    res.json(bookingsWithUser);
  } catch (err) {
    console.log("DB Error:", err);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

// Get available slots for a date
export const getAvailableSlots: RequestHandler = async (req, res) => {
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

    interface BookingTime {
      time: Date;
    }

    const booked: string[] = bookings.map((b: BookingTime) =>
      b.time instanceof Date
        ? b.time.toISOString().slice(11, 16)
        : String(b.time).slice(0, 5)
    );
    const available = AVAILABLE_HOURS.filter((t) => !booked.includes(t));

    res.json({ available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

// Get a single booking by ID
export const getBookingById: RequestHandler = async (req, res) => {
  const bookingId = Number(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) return res.status(404).json({ error: "Not found" });

    // Fetch username from user-service
    let username = 'Gość';
    try {
      const resp = await axios.get(`http://user-service:3003/auth/user/${booking.userId}`);
      username = (resp.data as { username: string }).username;
    } catch {}

    res.json({
      id: booking.id,
      username: booking.username,
      service_type: booking.service,
      date: booking.date,
      time: booking.time,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching booking" });
  }
};

// Update a booking by ID
export const updateBooking: RequestHandler = async (req, res) => {
  const bookingId = Number(req.params.id);
  const { service_type, service, date, time } = req.body;
  const newService = service_type ?? service;
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: "Not found" });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        service: newService,
        date: new Date(date),
        time: new Date(`1970-01-01T${time}:00Z`), // convert to Date object
      }
    });
    res.json(updated);
  } catch (err) {
    console.error("Booking update error:", err);
    res.status(500).json({ error: "Error updating booking" });
  }
};

// Delete a booking by ID
export const deleteBooking: RequestHandler = async (req, res) => {
  const bookingId = Number(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return res.status(404).json({ error: "Not found" });

    await prisma.booking.delete({ where: { id: bookingId } });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting booking" });
  }
};
