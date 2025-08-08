const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/users', userRoutes); // Mount user routes

// Default route
app.get('/', (req, res) => {
    res.send('Hello from Express + MongoDB Atlas');
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
