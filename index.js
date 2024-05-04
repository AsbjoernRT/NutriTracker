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
        secure: true,  // Set to true in production
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
    }
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
// app.use(express.static('functions'));

// Use route modules


// Serve files from the 'functions' directory with the correct MIME type
// app.use('/functions', express.static(path.join(currentDirectory, 'functions')));

// Serve static files from the 'helper' directory
// app.use(express.static(path.join(currentDirectory, 'helper')));


// Use route modules
// app.use('/user', userRoutes);
app.use('/', viewsRoutes);
app.use('/api', apiRoutes)
// app.use('/helper', helperRoutes);
// app.use('/functions', functionsRoutes);

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