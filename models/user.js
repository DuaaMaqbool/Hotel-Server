import mongoose from "mongoose";

// Create a schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },
    resetOTP: String,
    resetOTPExpiry: Date,
  },
  { timestamps: true }
);

// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
