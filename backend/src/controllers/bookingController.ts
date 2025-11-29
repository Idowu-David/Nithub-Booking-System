import { Response, Request } from "express";
import db from "../db";

export const createBooking = async (req: Request, res: Response) => {
  const { desk_id, date, start_time, duration } = req.body;

  try {
    const startMins = timeToMins(start_time);
    const endMins = startMins + duration;
    const end_time = minsToTime(endMins);

    // block user from booking another space while having an active one
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
    const activeSpace = await db.query(activeQuery, [1]); // i will insert real user id
    if (activeSpace.rows.length > 0) {
			return res.status(403).json({
        success: false,
        message:
					"You already have an active or upcoming booking. Please cancel or checkout first.",
				active_booking: activeSpace.rows[0]
				
      });
    }

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

export const bookingCheckout = async (req: Request, res: Response) => {
  const { desk_id } = req.body;

  const checkQuery = `
		SELECT * FROM bookings
		WHERE user_id = $1
	`;
  try {
    const check = await db.query(checkQuery, [1]);

    if (check.rows.length === 0) {
      return res.json({
        message: "User has no space to checkout",
      });
    }
  } catch (err) {
    console.log(err);
  }

  const toggleQuery = `
	UPDATE bookings
	set status = 'CHECKED OUT'
	WHERE desk_id = $1
	AND user_id = $2
	`;

  try {
    await db.query(toggleQuery, [desk_id, 1]);
    res.status(200).json({
      message: "User checked out of the space",
      desk_id: desk_id,
    });
  } catch (err) {
    console.error("Error", err);
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
