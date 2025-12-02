import { Router } from "express";
import { getAllDesks } from "../controllers/deskControllers";
import {
  bookingCheckout,
  createBooking,
} from "../controllers/bookingController";

const router = Router();

router.get("/", getAllDesks);
router.post("/booking", createBooking);
router.post("/booking/checkout", bookingCheckout);

export default router;
