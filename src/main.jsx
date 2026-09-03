import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { asset } from './lib/asset.js';
import './style.css';

document.documentElement.style.setProperty(
  '--poster-url',
  `url("${asset('assets/poster.jpg')}")`,
);

createRoot(document.getElementById('root')).render(<App />);
