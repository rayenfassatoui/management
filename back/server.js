require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projectRoute");
const userRoutes = require("./routes/userRoute");

// express app
const app = express();

// port
const { port, mongoUri } = require('./config');

// middlewares
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/user", userRoutes);

// connecting to the database
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Connected to MongoDB & Server running on port ${port}`);
      });
    }
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

// For Vercel serverless deployment
module.exports = app;
