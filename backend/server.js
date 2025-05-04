const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const cron = require('node-cron');
const { refreshTokens } = require('./utilities/refreshToken');
const session = require('express-session');

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Session & Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Route imports
const catalogRoutes = require('./routes/catalogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const googleRoutes = require('./routes/googleRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const authRoutes = require('./routes/paymentOauthRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const themeRoutes = require('./routes/themeRoutes');
const userRoutes = require('./routes/userRoutes');
const websiteVisitRoutes = require('./routes/websiteVisitRoutes');
const emailRoutes = require('./routes/emailRoutes');

// Register routes
app.use('/api/catalogs', catalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/places', googleRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/square', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/website-visits', websiteVisitRoutes);
app.use('/api/send-email', emailRoutes);

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health checks
app.get('/api/ping', (req, res) => res.send('Pong'));
app.get('/', (req, res) => res.send('Backend is running'));
app.get('/api', (req, res) => res.send('API is running'));

// Scheduled token refresh (daily at midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled token refresh...');
  await refreshTokens();
});

// Start server if this is the main module
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;
