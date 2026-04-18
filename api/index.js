const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');

dotenv.config({ path: './config.env' });

let isConnected = false;
let connectionPromise;

const connectDB = async () => {
  if (isConnected) return;

  if (!connectionPromise) {
    const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    connectionPromise = mongoose.connect(DB);
  }

  await connectionPromise;
  isConnected = true;
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
