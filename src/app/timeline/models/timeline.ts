import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    occurrences: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Occurrence" }],
  },
  { timestamps: true }
);

export const Timeline = mongoose.model("Timeline", TimelineSchema);
