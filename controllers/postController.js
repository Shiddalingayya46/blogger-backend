const Post = require("../models/posts");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const { description, userId, imageBase64, contentType } = req.body;

    if (!userId || !description || !imageBase64) {
      return res
        .status(400)
        .json({ message: "description, userId, and image are required" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      description,
      userId,
      imageData: {
        data: Buffer.from(imageBase64, "base64"), // convert base64 to binary
        contentType,
      },
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isDelete: { $ne: true } }); // optional: filter out deleted posts
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);

    if (!post || post.isDelete) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // const posts = await Post.find({ userId, isDelete: { $ne: true } });
    const posts = await Post.find({ userId, isDelete: false });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const softDeletePost = async (req, res) => {
  const { postId } = req.params;
  console.log("postId: ", postId);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.isDelete) {
      return res
        .status(400)
        .json({ message: "Post is already marked as deleted" });
    }

    post.isDelete = true;
    await post.save();

    res.status(200).json({ message: "Post marked as deleted", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const permanentDeletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.isDelete) {
      return res
        .status(400)
        .json({ message: "Post is not marked for deletion" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handlePostReaction = async (req, res) => {
  try {
    const { userId, postId, action } = req.body; // action = true (like), false (dislike)

    if (!userId || !postId || action === undefined) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes) post.likes = [];
    if (!post.disLikes) post.disLikes = [];

    if (action === true) {
      // --- LIKE operation ---
      if (post.likes.includes(userId)) {
        // Already liked → remove like
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // Add like → ensure dislike is removed
        post.disLikes = post.disLikes.filter(
          (id) => id.toString() !== userId.toString()
        );
        post.likes.push(userId);
      }
    } else {
      // --- DISLIKE operation ---
      if (post.disLikes.includes(userId)) {
        // Already disliked → remove dislike
        post.disLikes = post.disLikes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // Add dislike → ensure like is removed
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
        post.disLikes.push(userId);
      }
    }

    await post.save();

    return res.status(200).json({
      message: action ? "Like action processed" : "Dislike action processed",
      likesCount: post.likes.length,
      dislikesCount: post.disLikes.length,
      likes: post.likes,
      dislikes: post.disLikes,
    });
  } catch (error) {
    console.error("Reaction error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  permanentDeletePost,
  softDeletePost,
  handlePostReaction,
};
