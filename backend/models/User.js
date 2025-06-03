// Import the mongoose library
const mongoose = require('mongoose');

// Define a schema for the User model using mongoose.Schema
// This defines the structure of a user document in the MongoDB database
const userSchema = new mongoose.Schema(
  {
    // 'name' field: must be a string and is required
    name: {
      type: String,
      required: [true, 'Please enter your name'], // Custom error message if name is missing
    },

    // 'email' field: must be a string, is required, and must be unique
    email: {
      type: String,
      required: [true, 'Please enter your email'], // Custom error message if email is missing
      unique: true, // Ensures no two users can have the same email
    },

    // 'password' field: must be a string and is required
    password: {
      type: String,
      required: [true, 'Please enter your password'], // Custom error message if password is missing
    },
  },

  // Second argument: schema options
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps to each document
  }
);

// Export the model so it can be used in other files
// The first argument is the name of the collection ('User' becomes 'users' in MongoDB)
// The second argument is the schema we just defined
module.exports = mongoose.model("User", userSchema);
