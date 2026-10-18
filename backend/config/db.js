const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  console.log('Connected to MongoDB');
};

module.exports = connectDB;
