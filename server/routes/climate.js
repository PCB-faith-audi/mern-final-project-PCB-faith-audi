import express from "express";
import { getClimateData } from "../controllers/climateController.js";

const router = express.Router();

router.get("/climate", getClimateData);

export default router;
