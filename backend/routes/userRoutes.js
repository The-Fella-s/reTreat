const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Ensure CORS middleware is available
const connectDB = require('./config/db');
const { protect, adminOnly } = require('./middleware/authMiddleware'); // Import middleware

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Use CORS middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); // Keep if necessary

app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes); // Ensure this exists in the project

// Admin route
app.get('/api/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
