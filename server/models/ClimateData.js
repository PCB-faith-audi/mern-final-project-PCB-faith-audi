import mongoose from "mongoose";

const ClimateDataSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  fetchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("ClimateData", ClimateDataSchema);
