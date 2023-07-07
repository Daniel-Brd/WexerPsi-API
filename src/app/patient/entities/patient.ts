import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, required: true },
    timelines: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Timeline", required: true }],
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    contact: { type: String, required: true },
    demands: { type: String },
    personalAnnotations: { type: String },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", PatientSchema);
