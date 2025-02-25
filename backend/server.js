const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect, adminOnly } = require('./middleware/authMiddleware');
const cookieParser = require("cookie-parser");
const passport = require("./config/passport"); // Import Passport config
const cron = require("node-cron");
const { refreshTokens } = require("./utilities/refreshToken");

dotenv.config();

const app = express();

// Improved CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests
app.use(express.json()); // Middleware to parse JSON
connectDB(); // Connect Database

// Import and Register Routes
const userRoutes = require('./routes/userRoutes');
const themeRoutes = require('./routes/themeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const paymentRoutes = require('./routes/paymentsRoutes');
const instagramRoutes = require('./routes/instagramRoutes');

app.use('/api/users', userRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/instagram', instagramRoutes);

// Initialize passport for Facebook API
app.use(passport.initialize());

// Admin Dashboard Route (Secured)
app.get('/api/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

// Square API test
app.get('/api/square', (req, res) => {
  res.json({message: "Square API is running and working"})
});

// Root Test Route
app.get('/', (req, res) => res.send('API is running'));

// Schedule token refresh every day at midnight (adjust as needed)
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled token refresh...");
  await refreshTokens();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
