import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import materialUILogo from './assets/materialui.png';
import fontAwesomeLogo from './assets/font-awesome.svg';
import './App.css';
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontAwesomeLogoFull } from "@fortawesome/fontawesome-free-solid";
import Footer from './components/Footer';
import Contact from './components/ContactUs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div>
        <Routes>
          {/* Home Page (Main content) */}
          <Route path="/" element={
            <>
              {/* Logo Section */}
              <div>
                <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
                <a href="https://mui.com/" target="_blank">
                  <img src={materialUILogo} className="logo materialui" alt="MaterialUI logo" />
                </a>
                <a href="https://fontawesome.com/" target="_blank">
                  <img src={fontAwesomeLogo} className="logo fontawesome" alt="FontAwesome logo" />
                </a>
              </div>

              {/* Sample FontAwesome component */}
              <h1>Vite + React + MUI + <FontAwesomeIcon icon={faFontAwesomeLogoFull} /></h1>

              {/* Button Counter */}
              <div className="card">
                <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </Button>
                <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
              </div>

              <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
            </>
          } />

          {/* Contact Us Page */}
          <Route path="/contact-us" element={<Contact />} />
        </Routes>

        {/* Footer is outside the routes, it will show on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
