const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  addLikes,
  softDeletePost,
  permanentDeletePost,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.get("/user/:userId", getPostsByUserId);
router.post("/like", addLikes);
router.post("/soft-delete/:postId", softDeletePost);
router.delete("/hard-delete/:postId", permanentDeletePost);

module.exports = router;
