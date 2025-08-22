const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  softDeletePost,
  permanentDeletePost,
  handlePostReaction,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.get("/user/:userId", getPostsByUserId);
router.post("/soft-delete/:postId", softDeletePost);
router.delete("/hard-delete/:postId", permanentDeletePost);
router.put("/reaction", handlePostReaction);

module.exports = router;
