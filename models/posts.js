const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    userId: {
      type: Object,
      required: true,
    },
    likes: {
      type: Array,
      required: true,
      default: [],
    },
    disLikes: {
      type: Array,
      required: true,
      default: [],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    imageData: {
      data: Buffer, // binary data
      contentType: String, // e.g., "image/png"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
