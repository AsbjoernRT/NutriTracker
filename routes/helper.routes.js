const express = require('express');
const router = express.Router();
const path = require('path');

// import express from 'express';

// Existing routes for other helper files...

// Route for serving the sidebar helper
router.get('/sidebar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'helper', 'sidebar.js'));
});

// Export the router
module.exports = router;

router.get('/basicMetabolisme.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'helper', 'basicMetabolisme.js'))})
