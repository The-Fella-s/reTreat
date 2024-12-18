import React, { useEffect } from 'react';
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
import Profile from './components/Profile.jsx'; // Import Profile component
import Menu from './pages/Menu.jsx'; // Import Menu component
import { ToastContainer, toast } from 'react-toastify'; //Toastify components
import 'react-toastify/dist/ReactToastify.css';
import Payment from "./pages/Payment.jsx";
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/Theme.jsx'
import Main from './components/MainPage.jsx';
import AdminDashboard from './pages/admin-dashboard/AdminDashboard.jsx';

function App() {
  //Test for notification pop up on main page
  /*
  useEffect(() => {
    toast.success("Welcome to our website!");
  }, []); 
  */

  return (
    <Router>
      {/* Navigation Bar is outside the routes, it will show on every page */}
      <ThemeProvider theme = {theme}>
      <NavBar/>

      <div>
        {/* Place ToastContainer here */}
        <ToastContainer />

        <Routes>
          {/* Home Page (Main content) */}
          <Route path="/" element={
            <>
              <Main />
              <Reviews />
              <SocialMedia />
              <ReadyToRelax />
            </>
          } />

          {/* FAQ Page */}
          <Route path="/faq" element={<FAQ />} />

          {/* Contact Us Page */}
          <Route path="/contact-us" element={<Contact />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} /> 

          {/* Register Page */}
          <Route path="/register" element={<Register />} /> 

          {/* Meet the Team Page */}
          <Route path="/meet-the-team" element={<MeetTheTeam />} />

          {/* Book appointment page */}
          <Route path="/appointment" element={<BookAppointment />} />

          {/* Profile Page */}
          <Route path="/profile" element={<Profile />} /> {/* Added Profile Route */}

          <Route path="/menu" element={<Menu />} />

          {/* Payment Page */}
          <Route path="/payment" element={<Payment />} />

          {/* Dashboard Page */}
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
        
        {/* Footer is outside the routes, it will show on every page */}
        
        <Footer />
      </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
