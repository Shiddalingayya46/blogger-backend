// config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:');
    console.error(err);
    process.exit(1);
  }
}

// ✅ Export the function
module.exports = connectToMongoDB;
