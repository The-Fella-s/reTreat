import React from 'react';
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
import BookAppointment from './pages/BookAppointment.jsx';
import Profile from './components/Profile.jsx';
import Menu from './pages/Menu.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Payment from './pages/Payment.jsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/Theme.jsx';
import Main from './components/MainPage.jsx';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <NavBar />
          <div>
            <ToastContainer />

            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <>
                    <Main />
                    <Reviews />
                    <SocialMedia />
                    <ReadyToRelax />
                  </>
                }
              />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/meet-the-team" element={<MeetTheTeam />} />
              <Route path="/appointment" element={<BookAppointment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/payment" element={<Payment />} />

              {/* Protected Admin Route */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
              </Route>
            </Routes>

            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
