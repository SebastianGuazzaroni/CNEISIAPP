import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App.jsx';

document.documentElement.setAttribute('data-bs-theme', 'dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
