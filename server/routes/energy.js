import express from "express";
import { addEnergyLog, getEnergyLogs, updateEnergyLog, deleteEnergyLog } from "../controllers/energyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/energy", requireAuth, addEnergyLog);
router.get("/energy", requireAuth, getEnergyLogs);
router.put("/energy/:id", requireAuth, updateEnergyLog);
router.delete("/energy/:id", requireAuth, deleteEnergyLog);

export default router;
