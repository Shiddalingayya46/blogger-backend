const mongoose = require("mongoose");
const LikesSchema = new mongoose.Schema(
  {
    userId: {
      type: Array,
      required: true,
      default: [],
    },
    postId: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("likes", LikesSchema);
