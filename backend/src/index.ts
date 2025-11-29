import express, {Request, Response} from "express";

const app = express();
const PORT = 4000;

app.use(express.json());


interface Booking {
    id: number;
    userName: string;
    email: string;
    space: string; 
    date: string;
    startTime: string;
    endTime: string;
}

const bookings:Booking[] = [
    {
        id: Date.now(),
        userName: "umlat",
        email: "umlat.at104@gmail.com",
        space: "dek-2",
        date: "14-02-25",
        startTime: "12:00",
        endTime: "24:00"
    }
]

app.post("/bookings", (req: Request, res: Response) => {
    const { userName, email, space, date, startTime, endTime } = req.body;

    // 1️⃣ VALIDATE FIELDS FIRST
    if (!userName || !email || !space || !date || !startTime || !endTime) {
        return res.status(400).json({ message: "Fill all fields" });
    }

    // 2️⃣ CREATE BOOKING
    const newBooking: Booking = {
        id: Date.now(),
        userName,
        email,
        space,
        date,
        startTime,
        endTime
    };

    // 3️⃣ SAVE BOOKING
    bookings.push(newBooking);

    // 4️⃣ RESPONSE
    res.json({
        message: "Your space has been reserved",
        booking: newBooking
    });
});

app.get("/bookings", (req:Request, res:Response) =>{
    res.json(bookings)
})
 
app.delete("/bookings/:id", (req: Request, res: Response) => {
    const bookingId = Number(req.params.id);

    const index = bookings.findIndex(b => b.id === bookingId);

    if (index === -1) {
        return res.status(404).json({
            error: `Booking with ID ${bookingId} not found.`,
        });
    }

    bookings.splice(index, 1);

    return res.status(200).json({
        message: `Booking with ID ${bookingId} deleted successfully.`,
    });
});


app.listen(PORT,()=> {
    console.log(`server is running on http://localhost:${PORT}`)
})