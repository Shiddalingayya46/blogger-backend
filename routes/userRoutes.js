const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  deleteUser,
  login,
  getUserById,
  updateUser,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);
router.post("/login", login);
router.put("/update/:userId", updateUser);
router.get("/get-user/:userId", getUserById);

module.exports = router;
