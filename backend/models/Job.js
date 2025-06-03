// ----------------------------------------------
// Import Mongoose to define the schema
// ----------------------------------------------
const mongoose = require('mongoose');

// ----------------------------------------------
// Define the Job Schema
// ----------------------------------------------
const jobSchema = new mongoose.Schema(
  {
    // Reference to the user who created the job entry
    user: {
      type: mongoose.Schema.Types.ObjectId, // References a User document by its unique ObjectId
      ref: 'User', // Refers to the "User" model (i.e., collection)
      required: true, // This field must be provided
    },

    // Name of the company where the job is applied
    company: {
      type: String,
      required: [true, "Company name is required"], // Custom error message if not provided
    },

    // Job position or title applied for
    position: {
      type: String,
      required: [true, "Job position is required"], // Custom error message if not provided
    },

    // Current status of the job application
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected"], // Allowed values for status
      default: "applied", // Default value if not provided
    },

    // Location of the job (can be remote or physical)
    jobLocation: {
      type: String,
      default: "Remote", // Default to "Remote" if not provided
    },

    // Salary offered or expected for the job
    salary: {
      type: String,
      default: "N/A", // Default to "N/A" if salary is not known or provided
    },

    // Scheduled date for interview, if any
    interviewDate: {
      type: Date, // Optional field to store interview date
    },

    // Additional notes or comments related to the job
    notes: {
      type: String, // Optional free-text field for any notes
    },
  },
  {
    // ----------------------------------------------
    // Schema Options
    // ----------------------------------------------
    timestamps: true, // Automatically adds createdAt and updatedAt fields to each document
  }
);

module.exports = mongoose.model("Job", jobSchema); // Export the Job model based on the defined schema
// This model will be used to interact with the "jobs" collection in MongoDB