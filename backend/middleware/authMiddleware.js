// authMiddleware.js

// Import the JWT library to handle token verification
const jwt = require('jsonwebtoken');

// Authentication Middleware to protect private routes
const authMiddleware = (req, res, next) => {
  // const token = req.headers('Authorization');

  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists in the header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  // Extract the actual token from the string "Bearer <token>"
  const token = authHeader.split(" ")[1];
  console.log("Token:", authHeader); // Log the token for debugging

  try {
    // Verify the token using the secret key (from .env file)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    req.user = decoded.userId;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    // Token is invalid or expired
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

// Export the middleware to use it in routes
module.exports = authMiddleware;
