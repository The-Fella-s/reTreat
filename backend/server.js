const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { protect, adminOnly } = require('./middleware/authMiddleware'); // ✅ Ensure this is imported

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ✅ Add this admin-protected route directly in `server.js`
app.get('/api/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
