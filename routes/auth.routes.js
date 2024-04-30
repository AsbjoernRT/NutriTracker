// routes/authRoutes.js
import express from 'express';
import authService from '../functions/auth.functions';

const router = express.Router();


// Route for user registration
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     // Call the authService to register the user
//     await authService.registerUser(username, password);
//     // Log a message to the console when a user registers successfully
//     console.log(`User ${username} registered successfully`);
//     // Send a success response
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     // Handle errors
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

export default router;
