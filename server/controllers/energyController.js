import EnergyEntry from "../models/EnergyEntry.js";

export const addEnergyLog = async (req, res) => {
  try {
    const log = new EnergyEntry({ ...req.body, user: req.user.id });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getEnergyLogs = async (req, res) => {
  try {
    const logs = await EnergyEntry.find({ user: req.user.id });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateEnergyLog = async (req, res) => {
  try {
    const log = await EnergyEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEnergyLog = async (req, res) => {
  try {
    await EnergyEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
