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
import Register from "./pages/Register.jsx";
import MeetTheTeam from './Pages/MeetTheTeam.jsx';
import BookAppointment from "./pages/BookAppointment.jsx";
import Profile from './components/Profile.jsx';
import Menu from './pages/Menu.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Payment from "./pages/Payment.jsx";
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from './components/Theme.jsx';
import Main from './components/MainPage.jsx';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx';
import { createCustomTheme } from "./utilities/themeUtils.js";
import axios from "axios";
import {Box, CircularProgress, Grid2} from "@mui/material";

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
      <ThemeProvider theme={theme}>
        <NavBar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'background.default'
          }}
        >
          <ToastContainer />
          <Routes>
            <Route path="/" element={
              <>
                <Main />
                <Reviews />
                <SocialMedia />
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
          </Routes>
          <Footer />
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
