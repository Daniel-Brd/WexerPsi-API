import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    patients: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Patient" }],
    file: { type: mongoose.SchemaTypes.ObjectId, ref: "File" },
  },
  { timestamps: true }
);

export const user = mongoose.model("User", UserSchema);
