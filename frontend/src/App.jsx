import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import AuthProvider from './context/AuthContext.jsx';
import defaultTheme from './components/Theme.jsx';
import { createCustomTheme } from './utilities/themeUtils.js';

import Main from './pages/Main.jsx';
import Menu from './pages/menu.jsx';
import MeetTheTeam from './pages/MeetTheTeam.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import FAQ from './pages/faq.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './components/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Profile from './components/Profile.jsx';
import AdminDashboard from './pages/dashboard/Dashboard.jsx';
import EmployeeSchedule from './pages/EmployeeSchedule.jsx';
import Cart from './pages/Cart.jsx';
import WaiverForm from './pages/waiver.jsx';
import Unauthorized from './pages/Unauthorized';

import NavBar from './components/NavBar';
import Footer from './components/Footer';

function HomePageTracker() {
  const location = useLocation();
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    if (location.pathname === '/' && !hasTrackedVisit.current) {
      hasTrackedVisit.current = true;
      axios
        .post('http://localhost:5000/api/website-visits/track')
        .catch((err) => console.error('Error tracking visits:', err));
    }
  }, [location]);

  return null;
}

function App() {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/themes/active')
      .then((res) => {
        if (res.data) setTheme(createCustomTheme(res.data));
      })
      .catch((err) => console.error('Error fetching theme:', err));
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <HomePageTracker />
        <Box className="app-container">
          <NavBar />
          <Box className="main-content">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/meet-the-team" element={<MeetTheTeam />} />
              <Route path="/appointment" element={<BookAppointment />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard/*" element={<AdminDashboard setTheme={setTheme} />} />

              <Route path="/employee-schedule" element={<EmployeeSchedule />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/waiver" element={<WaiverForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
