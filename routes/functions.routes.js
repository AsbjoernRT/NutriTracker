const express = require('express');
const path = require('path');

// // Create a router instance
// const router = express.Router();

// // Define route handlers for serving JavaScript files
router.get('/register.functions.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'functions', 'register.functions.js'));
});

// router.get('/auth.functions.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'functions', 'auth.functions.js'));
// });

// // Define route handlers for handling POST requests

// //Route handler for user registration
// router.post('/register', async (req, res) => {
//     try {
//         // Extract user data from the request body
//         const userData = req.body;

//         // Perform validation, create user in the database, and send response as shown in the previous message

//     } catch (error) {
//         // Handle errors and send appropriate response
//         console.error('Error registering user:', error);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// });
// // Export the router
module.exports = router;