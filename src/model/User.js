import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, require: true, unique: true, trim: true },
    password: { type: String, trim: true },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
