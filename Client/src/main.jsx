import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import axios from 'axios'
// fix: ensure cookies (JWT) are sent with all requests
axios.defaults.withCredentials = true
import { AppContextProvider } from './context/AppContext'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </BrowserRouter>,
)
