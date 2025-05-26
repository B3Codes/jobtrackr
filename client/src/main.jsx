import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>    
      <AuthProvider> {/* Wrap app with AuthProvider: */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);