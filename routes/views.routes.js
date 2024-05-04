import express from 'express';
import { renderLogin } from '../controller/login.js';  // Adjust the path as necessary


// import path from 'path';

// Create a router instance
const router = express.Router();

// Then use it directly in your router setup
router.get('/login', renderLogin);
router.get('/', renderLogin);


// Define route handlers for serving HTML files
// router.get('/', (req, res) => {
//     res.sendFile('homepage.html', { root: './views' });
// });

router.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', { root: './views' });
});

router.get('/mealCreator', (req, res) => {
    res.sendFile('mealCreator.html', { root: './views' });
});

router.get('/mealTracker', (req, res) => {
    res.sendFile('mealTracker.html', { root: './views' });
});

router.get('/dailyNutri', (req, res) => {
    res.sendFile('dailyNutri.html', { root: './views' });
});

router.get('/activityTracker', (req, res) => {
    res.sendFile('activityTracker.html', { root: './views' });
});

// router.get('/login', (req, res) => {
//     res.sendFile('login.html', { root: './views' })
// });

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});

router.get('/settings', (req, res) => {
    res.sendFile('settings.html', { root: './views' });
});

//partials

router.get('/footer', (req, res) => {
    res.sendFile('footer.html', { root: './views/partials' });
});

router.get('/header', (req, res) => {
    res.sendFile('header.html', { root: './views/partials' });
});
export default router;
