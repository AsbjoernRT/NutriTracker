// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authService = require('../functions/auth.functions');

// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Call the authService to register the user
    await authService.registerUser(username, password);
    // Log a message to the console when a user registers successfully
    console.log(`User ${username} registered successfully`);
    // Send a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
