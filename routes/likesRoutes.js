// routes/likeRoutes.js
const express = require("express");
const { addUserLike } = require("../controllers/likesController");
const router = express.Router();

router.post("/", addUserLike);

module.exports = router;
