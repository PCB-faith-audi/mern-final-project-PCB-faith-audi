import mongoose from "mongoose";

const CarbonEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  energyValue: { type: Number, required: true },
  carbonFootprint: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("CarbonEntry", CarbonEntrySchema);
