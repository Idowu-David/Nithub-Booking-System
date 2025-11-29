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
