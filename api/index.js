require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }

  return app(req, res);
};