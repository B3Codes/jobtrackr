// Import Express framework to create routes
const express = require("express");

// Create a new router instance from Express
// Using a router helps modularize route definitions instead of crowding server.js
const router = express.Router();

// Import controller functions for job-related actions
// These functions contain the logic for creating, retrieving, updating, and deleting jobs
const {
  createJob,
  getJob,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// Import middleware that verifies JWT and authenticates the user
// Ensures that only logged-in users can access these routess
const authMiddleware = require("../middleware/authMiddleware");

// Import the getStats function from jobController
const { getStats } = require("../controllers/jobController");

// ===================== JOB ROUTES =====================
// All routes below are protected — user must be logged in (token must be valid)

// Create a new job entry
// POST method is used to *create* new resources
router.post("/job", authMiddleware, createJob);

// Get all jobs for the authenticated user
// GET is used for fetching data
router.get("/job", authMiddleware, getJob);

// This route will return the statistics of the jobs for the authenticated user
router.get("/job/stats", authMiddleware, getStats);

// Get a single jobs for the authenticated user
router.get("/job/:id", authMiddleware, getSingleJob);

// Update a specific job
// PUT is used for complete updates; we pass the job ID as a URL parameter
router.put("/job/:id", authMiddleware, updateJob);

// Delete a specific job
// DELETE method is used to remove a resource
router.delete("/job/:id", authMiddleware, deleteJob);

// Export the router to use in server.js
module.exports = router;
