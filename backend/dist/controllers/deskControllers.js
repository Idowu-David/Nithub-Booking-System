"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDesks = void 0;
const db_1 = __importDefault(require("../db"));
const getAllDesks = async (req, res) => {
    const { date, start, end, duration } = req.query;
    console.log("REQUEST: ", req.query);
    try {
        const allDesks = await db_1.default.query("SELECT * FROM desks WHERE is_active = TRUE ORDER BY id ASC");
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
		AND (start_time < $3 AND end_time > $2)
	`;
        const conflicts = await db_1.default.query(conflictQuery, [date, start, end]);
        const takenDeskIds = new Set(conflicts.rows.map((row) => row.desk_id));
        const labeledDesks = allDesks.rows.map((desk) => ({
            ...desk,
            available: !takenDeskIds.has(desk.id),
        }));
        res.json(labeledDesks);
    }
    catch (err) {
        console.error("INVENTORY ERROR:", err);
        res.status(500).json({
            error: "Failed to fetch desk inventory",
        });
    }
};
exports.getAllDesks = getAllDesks;
