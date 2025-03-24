import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Footer from './components/Footer';
import Contact from './components/ContactUs';
import FAQ from './pages/FAQ.jsx';
import Reviews from './components/Reviews';
import SocialMedia from './components/SocialMedia';
import ReadyToRelax from './components/ReadyToRelax';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import MeetTheTeam from './pages/MeetTheTeam.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Profile from './components/Profile.jsx';
import Menu from './pages/Menu.jsx';
import Payment from './pages/Payment.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import EmployeeSchedule from './pages/EmployeeSchedule.jsx';
import Cart from './pages/Cart.jsx';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from './components/Theme.jsx';
import Main from './components/MainPage.jsx';
import { createCustomTheme } from './utilities/themeUtils.js';
import { Box } from '@mui/material';
import AuthProvider from './context/AuthContext.jsx';

function HomePageTracker() {
  const location = useLocation();
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    if (location.pathname === '/' && !hasTrackedVisit.current) {
      hasTrackedVisit.current = true;
      axios.post('http://localhost:5000/api/website-visits/track')
        .catch(error => console.error("Error tracking visits:", error));
    }
  }, [location]);

  return null;
}

function App() {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    axios.get('http://localhost:5000/api/themes/active')
      .then(response => {
        if (response.data) {
          setTheme(createCustomTheme(response.data));
        }
      })
      .catch(error => console.error("Error fetching theme:", error));
  }, []);

  return (
    <>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <HomePageTracker />
          <Box className="app-container">
            <NavBar />
            <Box className="main-content">
              <ToastContainer />
              <Routes>
                <Route path="/" element={
                  <>
                    <Main />
                    <SocialMedia />
                    <Reviews />
                    <ReadyToRelax />
                  </>
                } />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/meet-the-team" element={<MeetTheTeam />} />
                <Route path="/appointment" element={<BookAppointment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard setTheme={setTheme} />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/employee-schedule" element={<EmployeeSchedule />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
