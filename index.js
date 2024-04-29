const express = require('express');
const path = require('path');

// Import route modules
const viewsRoutes = require('./routes/views.routes.js');
const helperRoutes = require('./routes/helper.routes.js');
const functionsRoutes = require('./routes/functions.routes.js');
// const helperRoutes = require('./routes/helper.routes');
// const functionsRoutes = require('./routes/functions.routes');

const app = express();
const port = process.env.PORT || 3000;

// Configure Express to serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, 'assets')));

// Serve files from the 'functions' directory with the correct MIME type
app.use('/functions', express.static(path.join(__dirname, 'functions')));
// Serve static files from the 'helper' directory

app.use(express.static(path.join(__dirname, 'helper')));


// Use route modules
app.use('/', viewsRoutes);
app.use('/helper', helperRoutes);
app.use('/functions', functionsRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


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