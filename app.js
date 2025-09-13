const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
const port = 3000;

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB Atlas");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
