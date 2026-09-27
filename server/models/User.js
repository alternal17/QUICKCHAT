import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // ✅ capital S
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  { timestamps: true }
);

// ✅ model name must match schema variable
const User = mongoose.model("User", userSchema);

export default User;
