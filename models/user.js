// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

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
      unique: true, // No two users can have same email
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    resetOTP: String,
    resetOTPExpiry: Date,
  },
  { timestamps: true }
);

// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
