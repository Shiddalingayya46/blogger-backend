const Post = require("../models/posts");
const User = require("../models/User");

// Create Post
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
        data: Buffer.from(imageBase64, "base64"),
        contentType,
      },
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get ALL active posts (paginated)
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isDeleted: false }) // ✅ fixed
      .populate("userId", "name _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ isDeleted: false });

    return res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get SINGLE post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get ACTIVE posts by user
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = { userId, isDeleted: false };
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, totalPages, currentPage: page, totalPosts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

// Get DELETED posts by user
const getDeletedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = { userId, isDeleted: true };
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ posts, totalPages, currentPage: page, totalPosts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching deleted posts" });
  }
};

// SOFT DELETE
const softDeletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { isDeleted: true },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post soft deleted", post });
  } catch (error) {
    res.status(500).json({ error: "Error soft deleting post" });
  }
};

// PERMANENT DELETE
const permanentDeletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await Post.findByIdAndDelete(postId);

    if (!deleted) return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Post permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error permanently deleting post" });
  }
};

// LIKE / DISLIKE
const handlePostReaction = async (req, res) => {
  try {
    const { userId, postId, action } = req.body; // action = true (like), false (dislike)

    if (!userId || !postId || action === undefined) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const post = await Post.findById(postId);
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    // init arrays
    if (!post.likes) post.likes = [];
    if (!post.disLikes) post.disLikes = [];

    if (action === true) {
      // LIKE
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        post.disLikes = post.disLikes.filter(
          (id) => id.toString() !== userId.toString()
        );
        post.likes.push(userId);
      }
    } else {
      // DISLIKE
      if (post.disLikes.includes(userId)) {
        post.disLikes = post.disLikes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
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
  getUserPosts,
  getDeletedPosts,
  softDeletePost,
  permanentDeletePost,
  handlePostReaction,
};
