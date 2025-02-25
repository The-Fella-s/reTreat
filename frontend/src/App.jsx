import EmployeeSchedule from './pages/EmployeeSchedule.jsx';
import React, { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Contact from './components/ContactUs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './pages/FAQ.jsx';
import Reviews from './components/Reviews';
import SocialMedia from './components/SocialMedia';
import ReadyToRelax from './components/ReadyToRelax';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Register from './pages/Register.jsx';
import MeetTheTeam from './pages/MeetTheTeam.jsx';
import BookAppointment from "./pages/BookAppointment.jsx";
import Profile from './components/Profile.jsx';
import Menu from './pages/Menu.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Payment from './pages/Payment.jsx';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from './components/Theme.jsx';
import Main from './components/MainPage.jsx';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx';
import { createCustomTheme } from "./utilities/themeUtils.js";
import axios from "axios";
import { Box } from "@mui/material";
import AuthProvider from "./context/AuthContext.jsx";
import AboutUs from "./pages/AboutUs.jsx";

function App() {

  // Use null as the initial state to indicate that the theme hasn't been loaded yet
  const [theme, setTheme] = useState(defaultTheme);

  // Pulls the active theme from the endpoint
  // If no active theme or backend, uses built in theme file
  useEffect(() => {
    axios.get('http://localhost:5000/api/themes/active')
      .then(response => {
        if (response.data) {
          setTheme(createCustomTheme(response.data));
        }
      })
      .catch(error => {
        console.error("Error fetching theme:", error);
      });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
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
                <Route path="/meet-the-team" element={<MeetTheTeam />} />
                <Route path="/appointment" element={<BookAppointment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/admin-dashboard/*" element={<AdminDashboard setTheme={setTheme} />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/employee-schedule" element={<EmployeeSchedule />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
