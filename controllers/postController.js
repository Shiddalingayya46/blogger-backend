const Post = require("../models/posts");
const User = require("../models/User");

const createPost = async (req, res) => {
  const { description, userId } = req.body;

  if (!userId || !description) {
    return res
      .status(400)
      .json({ message: "description and userId are required" });
  }

  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({ description, userId });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addLikes = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log('userId: ', userId);
    console.log('postId: ', postId);

    if (!postId) {
      return res.status(400).json({ message: "Post ID cannot be empty" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID cannot be empty" });
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({ message: "Like added", likesCount: post.likes.length, likes: post.likes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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
module.exports = {
  createPost,
  addLikes,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  permanentDeletePost,
  softDeletePost,
};
