const Post = require("../models/posts");
const User = require("../models/user");

exports.createPost = async (req, res) => {
    const { description, userId } = req.body;

    if (!userId || !description) {
        return res.status(400).json({ message: "description and userId are required" });
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
