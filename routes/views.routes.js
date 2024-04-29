const express = require('express');
const path = require('path');

// Create a router instance
const router = express.Router();

// Define route handlers for serving HTML files
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'homepage.html'));
});

// router.get('/mealTracker', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'mealTracker.html'));
// });
router.get('/mealTracker.html', (req, res) => {
    console.log('Accessing homepage');
    res.sendFile(path.join(__dirname, '..', 'views', 'mealTracker.html'));
});

router.get('/mealCreator.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'mealCreator.html'));
});

router.get('/activityTracker.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'activityTracker.html'));
});

router.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

router.get('/nutriReport.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'nutriReport.html'));
});

router.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
});

router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'header.html'));
});

router.get('/footer.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'footer.html'));
});

router.get('/settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings.html'));
});


// Export the router
module.exports = router;
