import { Router } from "express";
import { getAllDesks, createBooking } from "../controllers/deskControllers";

const router = Router();

router.get("/", getAllDesks);
router.post("/booking", createBooking)

export default router;
