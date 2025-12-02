import { Response, Request } from "express";
import db from "../db";

// --- HELPER FUNCTIONS ---
const timeToMins = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number): string => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}:00`;
};

// --- CONTROLLERS ---

export const createBooking = async (req: Request, res: Response) => {
  const { user_id, desk_id, date, start_time, duration } = req.body;

  try {
    // 1. FIX: Explicitly convert IDs to Integers
    // localStorage sends strings, but DB needs Integers.
    const userIdInt = parseInt(user_id, 10);
    const deskIdInt = parseInt(desk_id, 10);

    // Validate inputs
    if (isNaN(userIdInt) || isNaN(deskIdInt)) {
      return res.status(400).json({
        success: false,
        error: "Invalid User ID or Desk ID. Must be numbers.",
      });
    }

    // Time math
    const startMins = timeToMins(start_time);
    const endMins = startMins + duration;
    const end_time = minsToTime(endMins);

    // 2. CHECK ACTIVE BOOKINGS (Using userIdInt)
    const activeQuery = `
      SELECT * FROM bookings
      WHERE user_id = $1
      AND status = 'CONFIRMED'
      AND (
        booking_date > CURRENT_DATE
        OR
        (booking_date = CURRENT_DATE AND end_time > CURRENT_TIME)
      )
    `;

    const activeSpace = await db.query(activeQuery, [userIdInt]);

    if (activeSpace.rows.length > 0) {
      return res.status(403).json({
        success: false,
        message:
          "You already have an active or upcoming booking. Please cancel or checkout first.",
        active_booking: activeSpace.rows[0],
      });
    }

    // 3. CHECK CONFLICTS (Using deskIdInt)
    const checkQuery = `
      SELECT * FROM bookings
      WHERE desk_id = $1
      AND booking_date = $2
      AND status = 'CONFIRMED'
      AND (start_time < $4 AND end_time > $3)
    `;

    const conflict = await db.query(checkQuery, [
      deskIdInt,
      date,
      start_time,
      end_time,
    ]);

    if (conflict.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Slot just taken. Please pick another slot",
      });
    }

    // 4. INSERT BOOKING
    const insertQuery = `
      INSERT INTO bookings (user_id, desk_id, booking_date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, 'CONFIRMED')
      RETURNING id
    `;

    const newBooking = await db.query(insertQuery, [
      userIdInt,
      deskIdInt,
      date,
      start_time,
      end_time,
    ]);

    res.json({
      success: true,
      booking_id: newBooking.rows[0].id,
      message: "Booking confirmed!",
    });
  } catch (err) {
    console.error("Booking Error", err);
    res.status(500).json({
      success: false,
      error: "Database error during booking.",
    });
  }
};

export const bookingCheckout = async (req: Request, res: Response) => {
  const { user_id, desk_id } = req.body;

  try {
    const userIdInt = parseInt(user_id, 10);
    const deskIdInt = parseInt(desk_id, 10);

    if (isNaN(userIdInt) || isNaN(deskIdInt)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid IDs provided" });
    }

    const checkQuery = `
      SELECT * FROM bookings
      WHERE user_id = $1
      AND desk_id = $2
      AND status = 'CONFIRMED'
    `;

    const check = await db.query(checkQuery, [userIdInt, deskIdInt]);

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User has no active space to checkout",
      });
    }

    const toggleQuery = `
      UPDATE bookings
      set status = 'CHECKED OUT'
      WHERE desk_id = $1
      AND user_id = $2
      AND status = 'CONFIRMED'
    `;

    await db.query(toggleQuery, [deskIdInt, userIdInt]);

    res.status(200).json({
      success: true,
      message: "User checked out of the space",
      desk_id: deskIdInt,
    });
  } catch (err) {
    console.error("Checkout Error", err);
    res
      .status(500)
      .json({ success: false, error: "Server error during checkout" });
  }
};
