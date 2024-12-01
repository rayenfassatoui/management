require("dotenv").config({ path: '../.env' });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projectRoute");
const userRoutes = require("./routes/userRoute");

// express app
const app = express();

// port
const { port, mongoUri  } = require('./config');
// middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/user", userRoutes);

// connecting to the database(mongodb)
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
