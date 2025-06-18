import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./assets/styles/global.css";
import {BrowserRouter as Router} from "react-router-dom";
import AuthContextProvider from "./assets/context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>

            <Router>
                <AuthContextProvider>
                <App/>
                </AuthContextProvider>
            </Router>

    </StrictMode>,
);

