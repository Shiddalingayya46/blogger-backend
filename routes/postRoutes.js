const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts, // ✅ fixed name
  softDeletePost,
  permanentDeletePost,
  handlePostReaction,
  getDeletedPosts,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.get("/user/:userId", getUserPosts); // ✅ fixed name
router.put("/soft-delete/:postId", softDeletePost);
router.delete("/permanent-delete/:postId", permanentDeletePost);
router.put("/reaction", handlePostReaction);
router.get("/user/:userId/deleted", getDeletedPosts);

module.exports = router;
