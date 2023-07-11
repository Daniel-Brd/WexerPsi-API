import mongoose from "mongoose";

const OccurrenceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    kind: { type: String, required: true },
    files: [{ type: mongoose.SchemaTypes.ObjectId }],
  },
  { timestamps: true }
);

export const Occurrence = mongoose.model("Occurrence", OccurrenceSchema);
