import { Router } from "express";
import { getAllDesks } from "../controllers/deskControllers";

const router = Router();

router.get("/", getAllDesks);

export default router;
