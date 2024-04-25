const express = require('express')
const app = express()
const path = require('path'); // require the path module
const port = process.env.PORT || 3000

// Serve static files from the 'public' directory
app.use(express.static('assets'))

app.use(express.static('helpers'));

// Optional: Specific route to serve the homepage.html when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
})

//Pages included:

app.get('/mealTracker.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealTracker.html'));
});

app.get('/mealCreator.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealCreator.html'));
});

app.get('/activityTracker.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'activityTracker.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/nutriReport.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'nutriReport.html'));
});

// Serve a specific HTML file on a specific route
app.get('/header.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'header.html'));
});

// Serve the JavaScript file on a specific route
app.get('/load-header', (req, res) => {
  res.sendFile(path.join(__dirname, 'helpers', 'loadHeader.js'));
});

app.get('/user.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'helpers', 'user.js'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
