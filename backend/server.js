const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware to parse incoming requests
app.use(express.json());

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.send('API is running');
  });

// Define the port from .env or default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});