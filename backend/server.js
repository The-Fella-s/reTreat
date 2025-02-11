const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cors = require('cors');
const { protect, adminOnly } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// First: Configure CORS before routes
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Connect Database
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);
const themeRoutes = require('./routes/themeRoutes')
app.use('/api/themes', themeRoutes);

// Admin route
app.get('/api/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
