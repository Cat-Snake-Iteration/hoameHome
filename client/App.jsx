import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import routing components
import Dashboard from './components/DashBoard';
import Login from './components/Login';
import { useState } from 'react';

/*
  Handles routing and manages login state
*/

const App = () => {
  // state to track user logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // funciton to handle logout and update state
  const handleLogout = () => {
    setIsLoggedIn(false); // This will handle updating the state to reflect logged out status
  };

  return (
    <Routes>
      {/*if logged in then redirect to dashboard, else redirect to login */}
      <Route
        path='/'
        element={
          isLoggedIn ? <Navigate to='/dashboard' /> : <Navigate to='/login' />
        }
      />

      {/* define login route */}
      <Route path='/login' element={<Login onLogin={setIsLoggedIn} />} />

      {/* define dashboard route, and logout handling */}
      <Route
        path='/dashboard'
        element={<Dashboard onLogout={() => setIsLoggedIn(false)} />}
      />
    </Routes>
  );
};

export default App;
