require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projectRoute");
const userRoutes = require("./routes/userRoute");

// express app
const app = express();

// middlewares
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// connecting to the database(mongodb)
mongoose.set("strictQuery", false);

// Only connect to MongoDB if we're not in a Vercel environment
if (process.env.NODE_ENV !== 'production') {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      const port = process.env.PORT || 4000;
      app.listen(port, () => {
        console.log(`Connected to MongoDB & Server running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      process.exit(1);
    });
}

// For Vercel, we'll connect to MongoDB for each request
if (process.env.NODE_ENV === 'production') {
  let cachedDb = null;

  async function connectToDatabase() {
    if (cachedDb) {
      return cachedDb;
    }
    
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    cachedDb = db;
    return db;
  }

  app.use(async (req, res, next) => {
    try {
      await connectToDatabase();
      next();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      res.status(500).json({ error: 'Database connection failed' });
    }
  });
}

module.exports = app;
