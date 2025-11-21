import { Router } from "express";
import { getLatest } from "../controllers/newsController.js";

const router = Router();

router.get("/", getLatest);

export default router;