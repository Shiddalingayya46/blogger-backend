const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const likesRoutes = require("./routes/likesRoutes");

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/like", likesRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB Atlas");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
