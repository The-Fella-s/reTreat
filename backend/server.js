const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
const app = express();

// Middleware
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
