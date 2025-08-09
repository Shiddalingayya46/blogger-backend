// controllers/likeController.js
const Likes = require("../models/likes");
const Post = require("../models/posts");
const User = require("../models/User");

const addUserLike = async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ message: "postId and userId are required" });
  }

  try {
    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if Likes doc exists for this post
    let likeDoc = await Likes.findOne({ postId });

    if (likeDoc) {
      // Prevent duplicate likes from same user
      if (likeDoc.userId.includes(userId)) {
        return res
          .status(400)
          .json({ message: "User already liked this post" });
      }

      likeDoc.userId.push(userId);
      await likeDoc.save();
    } else {
      // Create new Likes doc
      likeDoc = new Likes({
        postId,
        userId: [userId],
      });
      await likeDoc.save();
    }

    // Update likes count in Post
    post.likes = likeDoc.userId.length;
    await post.save();

    return res
      .status(200)
      .json({ message: "Like added successfully", likes: post.likes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addUserLike };
