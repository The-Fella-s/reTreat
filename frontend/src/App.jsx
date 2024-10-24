import './App.css';
import Footer from './components/Footer';
import Contact from './components/ContactUs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from './pages/FAQ.jsx';
import Reviews from './components/Reviews';
import SocialMedia from './components/SocialMedia';
import ReadyToRelax from './components/ReadyToRelax';
import Login from './pages/Login';
import NavBar from './components/NavBar'
import Register from "./pages/Register.jsx";
import MeetTheTeam from './Pages/MeetTheTeam.jsx';
import BookAppointment from "./pages/BookAppointment.jsx";

function App() {

  return (
    
    <Router>
      {/*Navigation Bar is outside the routes, it will show on every page */}
      <NavBar/>
      <div>
        <Routes>
          {/* Home Page (Main content) */}
          <Route path="/" element={
            <>
              
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

        </Routes>
          {/* */}
        {/* Footer is outside the routes, it will show on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
