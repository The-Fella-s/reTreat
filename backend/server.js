const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect, adminOnly } = require('./middleware/authMiddleware');
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const cron = require("node-cron");
const { refreshTokens } = require("./utilities/refreshToken");
const session = require("express-session");

dotenv.config();

const app = express();

// Use JSON parsing middleware early
app.use(express.json());

// Improved CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'sandbox' }
}));
app.use(passport.initialize());
app.use(passport.session());

connectDB(); // Connect to the database

// Import and Register Routes
const catalogRoutes = require('./routes/catalogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const docusignRoutes=require('./routes/docusignRoutes');
const employeeRoutes = require('./routes/employeeRoutes')
const googleRoutes = require('./routes/googleRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const authRoutes= require('./routes/paymentOauthRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const statisticsRoutes = require("./routes/statisticsRoutes");
const teamRoutes = require('./routes/teamRoutes');
const themeRoutes = require('./routes/themeRoutes');
const userRoutes = require('./routes/userRoutes');
const waiverRoutes = require("./routes/waiverRoutes");
const websiteVisitRoutes = require('./routes/websiteVisitRoutes');

app.use('/api/catalogs', catalogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/docusign', docusignRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/places', googleRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/square', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/website-visits', websiteVisitRoutes);
app.use("/api/waivers", waiverRoutes);

app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ping pong
app.get('/api/ping', protect, adminOnly, (req, res) => {
  res.json({ message: 'Pong' });
});

app.get('/', (req, res) => res.send('API is running'));

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled token refresh...");
  await refreshTokens();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
