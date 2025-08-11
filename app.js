const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB Atlas");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
