import CarbonEntry from "../models/CarbonEntry.js";

export const addCarbonLog = async (req, res) => {
  try {
    const { energyValue } = req.body;
    const carbonFootprint = energyValue * 0.233;
    const log = new CarbonEntry({ user: req.user.id, energyValue, carbonFootprint });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCarbonLogs = async (req, res) => {
  try {
    const logs = await CarbonEntry.find({ user: req.user.id });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCarbonLog = async (req, res) => {
  try {
    const log = await CarbonEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCarbonLog = async (req, res) => {
  try {
    await CarbonEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
