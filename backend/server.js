const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Require CORS middleware

// Load environment variables
dotenv.config();
console.log('Environment Variables:', {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
});

const app = express(); // Initialize app here

// Middleware
app.use(cors()); // Use CORS middleware after initializing app
app.use(express.json());

// Connect Database
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

