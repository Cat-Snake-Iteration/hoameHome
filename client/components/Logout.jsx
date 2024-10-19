import React from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Handles logging out user then redirecting user to login page
*/

const Logout = () => {
  // hook to navigate
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    console.log('Logout button clicked'); // Log to check if button click works

    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included in the request
      });

      if (response.ok) {
        console.log('Logged out successfully');
        // Use navigate to redirect to the login page after successful logout
        navigate('/login');
      } else {
        console.error('Logout failed:', response);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    // button to logout
    <button onClick={handleLogout} className='logout'>
      Logout
    </button>
  );
};

export default Logout;
