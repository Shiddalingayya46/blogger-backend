const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      data: Buffer, // binary data
      contentType: String, // e.g., "image/png"
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Use existing model if already registered
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
