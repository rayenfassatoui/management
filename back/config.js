require('dotenv').config({ path: '../.env' });

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.SECRET,
  nodeEnv: process.env.NODE_ENV
}; 