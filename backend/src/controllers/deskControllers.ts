import { Request, Response } from "express";
import db from "../db";

export const getAllDesks = async (req: Request, res: Response) => {
  const { date, start, end } = req.query;

  try {
    const allDesks = await db.query(
      "SELECT * FROM desks WHERE is_active = TRUE ORDER BY id ASC"
    );

    if (!date || !start || !end) {
      const greenDesks = allDesks.rows.map((desk) => ({
        ...desk,
        available: true,
      }));
      res.json(greenDesks);
      return;
    }

    const conflictQuery = `
		SELECT DISTINCT desk_id
		FROM bookings
		WHERE booking_date = $1
		AND status = 'CONFIRMED'
		AND (start_time <= $3 AND end_time > $2)
	`;

    const conflicts = await db.query(conflictQuery, [date, start, end]);
    const takenDeskIds = new Set(conflicts.rows.map((row) => row.desk_id));

    const labeledDesks = allDesks.rows.map((desk) => ({
      ...desk,
      available: !takenDeskIds.has(desk.id),
    }));
    res.json(labeledDesks);
  } catch (err) {
    console.error("INVENTORY ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch desk inventory",
    });
  }
};

const timeToMins = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}:00`;
};

export const createBooking = async (req: Request, res: Response) => {
  const { desk_id, date, start_time, duration } = req.body;

  try {
    const startMins = timeToMins(start_time);
    const endMins = startMins + duration;
    const end_time = minsToTime(endMins);

    const checkQuery = `
			SELECT * FROM bookings
			WHERE desk_id = $1
			AND booking_date = $2
			AND status = 'CONFIRMED'
			AND (start_time < $4 AND end_time > $3)
		`;

    const conflict = await db.query(checkQuery, [
      desk_id,
      date,
      start_time,
      end_time,
    ]);

    if (conflict.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: "Slot just taken. Please pick another slot",
      });
      return;
    }
    const insertQuery = `
			INSERT INTO bookings (user_id, desk_id, booking_date, start_time, end_time, status)
			VALUES ($1, $2, $3, $4, $5, 'CONFIRMED')
			RETURNING id
		`;

    const newBooking = await db.query(insertQuery, [
      1,
      desk_id,
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
      error: "Database error",
    });
  }
};
