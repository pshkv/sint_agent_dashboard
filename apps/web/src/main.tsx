import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App-Simple.tsx';
import './index.css';
import './styles/animations.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
