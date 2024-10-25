import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

/*
  Handles user authenticaion with input for username and password
  along with a login button and when successful login it goes to dashboard
*/

const Login = ({ onLogin }) => {
    // hook to navigate
  const navigate = useNavigate();
  // state vars
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  // potential error handler
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //HANDLE LOGIN WITH OAUTH
  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Login successful!', response);
      setUser(response.access_token); // assuming response contains profile info
      console.log('google user', user);
    },
    onError: () => {
      console.log('Login failed');
    },
  });

  useEffect(() => {
    const fetchUserInfo = async (user) => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json();
        console.log('User Info:', userInfo);
        fetchData(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    const fetchData = async (userInfo) => {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ userInfo }),
          body: JSON.stringify({username: userInfo.email, // Use email as username
            google_id: userInfo.id, // Use Google ID for tracking
            oauth_provider: 'google',
            first_name: userInfo.given_name,
            last_name: userInfo.family_name
          })
        });

        console.log('response', response);
        if (response.ok) {
          const data = await response.json();
          console.log('Logged in user data:', data);
          // This will log the updated user
          // setIsLoggedIn(data.loggedInUser)
          setIsLoggedIn(data.login);
          navigate('/dashboard', {state: {prop: userInfo.given_name} }); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (user) {
      fetchUserInfo(user);
    }
  }, [user]); // Runs whenever `user` is updated
  //ABOVE HANDLE LOGIN WITH OAUTH

  // function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for session management
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      console.log('DATAFIRSTNAME', data);

      // upon successful login, update state
      if (response.ok) {
        onLogin({isLoggedIn: true});
        // onLogin(true); // Update the login state to true
        // console.log("I AM HERE WHERE I AM WANTING TO BE!!!!!!!")
        navigate('/dashboard', {state: {prop: data.firstName} }); // Redirect to dashboard
      } else {
        console.error('Login failed:', data);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // prevent refresh on submit

  //   if (username === 'user' && password === 'password') {
  //     onLoginSucess(); // call parent func if login is right
  //   } else {
  //     // show alert if login is wrong
  //     alert('invalid login');
  //   }
  // };

  return (
    <div className='loginBody'>
      <div className='loginComponent'>
        <h2 className='pageTitle'>HOAme</h2>
        <p className='mantra'>You're almost hoame</p>

        {/* input field for username */}
        <input
          type='text'
          placeholder='Username'
          value={username}
          className='loginPrompt'
          onChange={(e) => setUsername(e.target.value)} // update state
        />

        {/* input field for password */}
        <input
          type='password'
          placeholder='Password'
          className='loginPrompt'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* button for login */}
        <div className='loginButton'>
          <button onClick={handleLogin} type='submit' className='loginButton1'>
            Login
          </button>

          {/* potential button for google login */}
          <button
            onClick={() => login()}
            className='loginButton1'
          >
            {' '}
            Login with Google{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
