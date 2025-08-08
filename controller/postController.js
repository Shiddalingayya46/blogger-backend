const post = require("../models/posts")

// create User
exports.createPost = async(req, res) => {
    const {description, userId, likes, isDelete } = req.body;
    try {
        const post = await user.find({userId})
        if(!userId) return res.status(404).json({message : " user  not found"})
         
      const posts = new post(req.body);
      const SavedPost = await posts.save();
      res.status(201).json(SavedPost);

    } catch (error){
        res.status(500).json({ error : error.message})
    }
}
