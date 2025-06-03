// ----------------------------------------------
// Import Required Modules
// ----------------------------------------------
const express = require('express');        // Framework for building APIs and web servers
const dotenv = require('dotenv');          // Loads environment variables from a .env file
const connectDB = require('./config/db');  // Function to connect to MongoDB
const cors = require('cors');              // Enables Cross-Origin Resource Sharing
const authRoutes = require('./routes/authRoutes'); // Route handlers for authentication-related APIs
const authMiddleware = require('./middleware/authMiddleware'); // Middleware for authentication checks
const jobRoutes = require('./routes/jobRoutes'); // Route handlers for job-related APIs

// ----------------------------------------------
// Load Environment Variables
// ----------------------------------------------
// dotenv.config() loads variables like DB_URI, PORT, JWT_SECRET from .env file into process.env
dotenv.config();

// ----------------------------------------------
// Connect to MongoDB Database
// ----------------------------------------------
connectDB(); // This function connects your server to the MongoDB database using Mongoose

// ----------------------------------------------
// Create Express Application
// ----------------------------------------------
const app = express(); // Initializes the Express application

// ----------------------------------------------
// Middlewares
// ----------------------------------------------

// Enable CORS to allow requests from different domains (e.g., frontend running on a different port)
app.use(cors());

// Parses incoming requests with JSON payloads (e.g., req.body)
app.use(express.json());

// Use authentication-related routes for endpoints starting with /api/auth
app.use("/api/auth", authRoutes); 

// Use job-related routes for endpoints starting with /api/job
app.use("/api", jobRoutes); 

// ----------------------------------------------
// Sample Test Route
// ----------------------------------------------
// Used to quickly check if API server is running correctly
app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  // This route is protected and requires authentication
  res.json({ message: "You are logged in", userId: req.user });
})

// ----------------------------------------------
// Start the Server
// ----------------------------------------------
const PORT = process.env.PORT || 5000; // Use PORT from .env, or default to 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
