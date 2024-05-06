import express from 'express';
const app = express();

import session from 'express-session'

import dotenv from 'dotenv';
dotenv.config();

// Import route modules
import viewsRoutes from './routes/views.routes.js';
import apiRoutes from './routes/api.routes.js';
// import helperRoutes from './routes/helper.routes.js';
// import functionsRoutes from './routes/functions.routes.js';
// import openapi from '.router/open.api.js';

import { config } from './config/config.js';
import Database from './database/database.js';

// import userRoutes from './routes/user.route.js';
// import { getUser } from './routes/user.route.js';




// const helperRoutes = require('./routes/helper.routes');
// const functionsRoutes = require('./routes/functions.routes');


const port = process.env.PORT || 3000;


// Her gør vi serveren i stand til at læse requests' body's
app.use(express.urlencoded({ extended: true }));
// Configure Express to serve static files from the 'assets' directory
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: false,
    cookie: {
        secure: false,  // Set to true in production
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    },
    name: 'NutriTracker.sid'
}));

// Initialize database
const database = new Database(config);
database.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(e => console.error('Failed to connect to the database', e));

// const user = require('./routes/user.route');

app.use(express.static('assets'));
// app.use(express.static('views'));
app.use(express.static('helper'));


// Use route modules
app.use('/', viewsRoutes);
app.use('/api', apiRoutes)
// app.use('/helper', helperRoutes);
// app.use('/functions', functionsRoutes);

// / Define the POST route for logout
app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Failed to log out');
            } else {
                res.clearCookie('connect.sid'); // Ensure you have the correct session cookie name
                res.redirect('/login'); // Redirect to home page or login page
            }
        });
    } else {
        res.end('No session to log out');
    }
});

app.get('/api/userinfo', (req, res) => {
  if (req.session.user && req.session.loggedin) {
      // getting the user info from session.
      res.json({ name: req.session.user.name });
      console.log(req.session.user.name);
  } else {
    //error response.
      res.status(401).json({ error: 'Unauthorized' }); // User not logged in
  }
});

app.post('/calculateBMR', (req, res) => {
  const { age, gender, weight } = req.body;
  const basalMetabolism = calculateBasalMetabolism(age, gender, weight);
  res.json({ basalMetabolism });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


export default { connectedDatabase: database }


// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');
// // Session middleware setup


// Access the session as req.session
// app.get('/', function(req, res, next) {
// 	console.log(req.session)
//   res.send('Hello World!')
// })
// // Middleware function to make user data accessible in views
// app.use(function(req, res, next) {
//   res.locals.user = req.session.user; // Assuming user data is stored in session
//   res.locals.currentPage = req.path;
//   next();
// });