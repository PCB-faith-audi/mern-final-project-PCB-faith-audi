import axios from "axios";

export const getClimateData = async (req, res) => {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&hourly=temperature_2m");
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
