
require('dotenv').config();

const config = {
  DBHost: process.env.MONGODB_URI,
  // Other configuration properties...
};

module.exports = config;

