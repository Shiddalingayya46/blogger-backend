const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
    imageData: {
      data: Buffer,
      contentType: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    disLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete flag
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
