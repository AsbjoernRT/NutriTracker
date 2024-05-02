import express from 'express';
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

const app = express();
const port = process.env.PORT || 3000;


// Her gør vi serveren i stand til at læse requests' body's
app.use(express.urlencoded({extended: true}));
// Configure Express to serve static files from the 'assets' directory

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
app.use('/api',apiRoutes)
// app.use('/helper', helperRoutes);
// app.use('/functions', functionsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default {connectedDatabase:database}


// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');
// // Session middleware setup
// app.use(session({
//   secret: secretKey,
//   resave: false,
//   saveUninitialized: false
// }));

// // Middleware function to make user data accessible in views
// app.use(function(req, res, next) {
//   res.locals.user = req.session.user; // Assuming user data is stored in session
//   res.locals.currentPage = req.path;
//   next();
// });