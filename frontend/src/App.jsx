import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import materialUILogo from './assets/materialui.png'
import fontAwesomeLogo from './assets/font-awesome.svg'
import './App.css'
import {Button} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFontAwesomeLogoFull} from "@fortawesome/fontawesome-free-solid";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
            <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo"/>
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo"/>
            </a>
            <a href="https://mui.com/" target="_blank">
                <img src={materialUILogo} className="logo materialui" alt="MaterialUI logo"/>
            </a>
            <a href="https://fontawesome.com/" target="_blank">
                <img src={fontAwesomeLogo} className="logo fontawesome" alt="FontAwesome logo"/>
            </a>
        </div>

        {/* Sample FontAwesome component */}
        <h1>Vite + React + MUI + <FontAwesomeIcon icon={faFontAwesomeLogoFull}></FontAwesomeIcon></h1>

        <div className="card">
            {/* Sample MaterialUI component */}
            <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </Button>

            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

    </>
  )
}

export default App
