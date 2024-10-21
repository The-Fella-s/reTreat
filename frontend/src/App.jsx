import './App.css';
import Footer from './components/Footer';
import Contact from './components/ContactUs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQ from '../src/pages/faq'; 
import Reviews from './components/Reviews';
import SocialMedia from './components/SocialMedia';
import ReadyToRelax from './components/ReadyToRelax';
import Login from './pages/Login';
import NavBar from './components/NavBar'

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
        </Routes>
          {/* */}
        {/* Footer is outside the routes, it will show on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
