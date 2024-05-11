import express from 'express';
import { authenticator } from '../controller/login.js';

// import path from 'path';

// Create a router instance
const router = express.Router();

// Then use it directly in your router setup
router.get('/login', async (req, res) => {
    const { renderLogin } = await import('../controller/login.js');
    renderLogin(req, res);
});
// router.get('/', renderLogin);


// Define route handlers for serving HTML files
router.get('/', authenticator, (req, res) => {
    res.sendFile('homepage.html', { root: './views' });
});

router.get('/dashboard', authenticator, (req, res) => {
    res.sendFile('dashboard.html', { root: './views' });
});

router.get('/mealCreator', authenticator, (req, res) => {
    res.sendFile('mealCreator.html', { root: './views' });
});

router.get('/mealTracker', authenticator, (req, res) => {
    res.sendFile('mealTracker.html', { root: './views' });
});

router.get('/dailyNutri', authenticator, (req, res) => {
    res.sendFile('dailyNutri.html', { root: './views' });
});

router.get('/activityTracker',authenticator, (req, res) => {
    res.sendFile('activityTracker.html', { root: './views' });
});

// router.get('/login', (req, res) => {
//     res.sendFile('login.html', { root: './views' })
// });

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});

router.get('/settings', authenticator, (req, res) => {
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
