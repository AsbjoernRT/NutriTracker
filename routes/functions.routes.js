const express = require('express');
const router = express.Router();
const path = require('path');

// // Create a router instance
// const router = express.Router();

// // Define route handlers for serving JavaScript files
router.get('/register.functions.js', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'functions', 'register.functions.js'));
});


// Export the router
module.exports = router;