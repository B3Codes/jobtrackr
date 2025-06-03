// Importing the User model to interact with the MongoDB User collection
const User = require('../models/User');

// Importing bcrypt for securely hashing passwords
const bcrypt = require('bcrypt');

// Importing jwt (JSON Web Token) to create tokens for user authentication
const jwt = require('jsonwebtoken');

// -------------------------------------------
// Controller function to handle user registration
// -------------------------------------------
exports.registerUser = async (req, res) => {
  try {
    // Extracting data from the request body
    const { name, email, password } = req.body;

    // Step 1: Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All the fields are required' });
    }

    // Step 2: Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Step 3: Hash the password before saving to the database
    // bcrypt.genSalt generates a random string (salt) to make the hash more secure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the salt

    // Step 4: Create a new User instance with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Step 5: Save the new user to the database
    await newUser.save();

    // Step 6: Respond to client with success
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    // Catch any unexpected server errors and respond
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// -------------------------------------------
// Controller function to handle user login
// -------------------------------------------
exports.loginUser = async (req, res) => {
  try {
    // Extracting data from the request body
    const { email, password } = req.body;

    // Step 1: Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'All the fields are required' });
    }

    // Step 2: Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 3: Compare the entered password with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 4: Generate a JWT token for the logged-in user
    // The payload contains the userId; the token is signed using a secret key
    // Token expires in 1 hour
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Step 5: Send the token and basic user info as response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });

  } catch (error) {
    // Catch and handle unexpected server errors
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}
