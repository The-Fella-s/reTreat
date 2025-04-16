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
const userRoutes = require('./routes/userRoutes');
const themeRoutes = require('./routes/themeRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); // NEW appointments route
const scheduleRoutes = require('./routes/scheduleRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentsRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const googleRoutes = require('./routes/googleRoutes');
const statisticsRoutes = require("./routes/statisticsRoutes");
const customerRoutes = require('./routes/customerRoutes');
const cardRoutes = require('./routes/cardRoutes');
const websiteVisitRoutes = require('./routes/websiteVisitRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const authRoutes= require('./routes/paymentOauthRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const employeeRoutes = require('./routes/employeeRoutes')
const teamRoutes = require('./routes/teamRoutes');
const docusignRoutes=require('./routes/docusignRoutes');

app.use('/api/square', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/places', googleRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/website-visits', websiteVisitRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/docusign', docusignRoutes);


app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

app.get('/api/square', (req, res) => {
  res.json({ message: "Square API is running and working" });
});

app.get('/', (req, res) => res.send('API is running'));

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled token refresh...");
  await refreshTokens();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
