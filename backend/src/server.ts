import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db";
import deskRoutes from "./routes/deskRoutes";
import authRouter from "./auth/authRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.use("/desks", deskRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is Running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
