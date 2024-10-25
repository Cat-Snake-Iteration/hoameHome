import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
const { GoogleOAuthProvider } = require('@react-oauth/google');
import App from './App';
import './styles/main.scss';
import './styles/directory.scss';
import './styles/announcements.scss';
import './styles/login.scss';
import './styles/dashboard.scss';
import './styles/documents.scss';

// get root where it will be render
const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId='70669525785-chgik7e7rdngn09p3b1mc1373bb80p9q.apps.googleusercontent.com'>
    {/* Wrap your App in BrowserRouter for routing */}
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);
