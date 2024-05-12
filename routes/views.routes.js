import express from 'express';
import { authenticator } from '../controller/login.js';

// import path from 'path';

// Opret en router-instans
const router = express.Router();

router.get('/login', async (req, res) => {
    const { renderLogin } = await import('../controller/login.js');
    renderLogin(req, res);
});



// Definer route-handlere til at vise HTML-filer

// Hjemmeside
router.get('/', authenticator, (req, res) => {
    res.sendFile('homepage.html', { root: './views' });
});

// Dashboard
router.get('/dashboard', authenticator, (req, res) => {
    res.sendFile('dashboard.html', { root: './views' });
});

// Måltidsopretter
router.get('/mealCreator', authenticator, (req, res) => {
    res.sendFile('mealCreator.html', { root: './views' });
});

// Måltidssporing
router.get('/mealTracker', authenticator, (req, res) => {
    res.sendFile('mealTracker.html', { root: './views' });
});

// Daglige næringsstoffer
router.get('/dailyNutri', authenticator, (req, res) => {
    res.sendFile('dailyNutri.html', { root: './views' });
});

// Aktivitetssporing
router.get('/activityTracker',authenticator, (req, res) => {
    res.sendFile('activityTracker.html', { root: './views' });
});

// router.get('/login', (req, res) => {
//     res.sendFile('login.html', { root: './views' })
// });

// Registrering
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './views' });
});

// Indstillinger
router.get('/settings', authenticator, (req, res) => {
    res.sendFile('settings.html', { root: './views' });
});

// Partielle visninger

// Footer
router.get('/footer', (req, res) => {
    res.sendFile('footer.html', { root: './views/partials' });
});

// Header
router.get('/header', (req, res) => {
    res.sendFile('header.html', { root: './views/partials' });
});
export default router;
