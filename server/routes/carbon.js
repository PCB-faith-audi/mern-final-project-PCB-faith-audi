import express from "express";
import { addCarbonLog, getCarbonLogs, updateCarbonLog, deleteCarbonLog } from "../controllers/carbonController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/carbon", requireAuth, addCarbonLog);
router.get("/carbon", requireAuth, getCarbonLogs);
router.put("/carbon/:id", requireAuth, updateCarbonLog);
router.delete("/carbon/:id", requireAuth, deleteCarbonLog);

export default router;
