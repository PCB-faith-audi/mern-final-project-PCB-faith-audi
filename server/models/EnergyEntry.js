import mongoose from "mongoose";

const EnergyEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("EnergyEntry", EnergyEntrySchema);
