require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projectRoute");
const userRoutes = require("./routes/userRoute");

// express app
const app = express();

// port
const port = process.env.PORT || 4000;

// middlewares
app.use(cors({
  origin: ['your-frontend-url.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/user", userRoutes);

// Add this before your other routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Add this after your routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// connecting to the database(mongodb)
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to MongoDB & Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
  });
