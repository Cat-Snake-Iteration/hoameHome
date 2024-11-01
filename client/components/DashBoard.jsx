import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Users from './Users';
import Announcements from './Announcements';
import Directory from './Directory';
import Documents from './Documents';
import Bids from './Bids';
import Logout from './Logout';
import home from '../styles/assets/png_h5pgb.png';
/*
  Componet serves as the main UI where users can go to differnt sections
  using tabs, it displays state and includes a logout function
  to handle signout
*/

const Dashboard = ({ onLogout, }) => {
  const location = useLocation(); // access specific data
  const firstName = location.state.prop; // get first name
  const accountInfo = location.state.accountInfo;
  const [userRole, setUserRole] = useState('');
  const userId = accountInfo.id;
  // console.log('userId :>> ', userId);

  const navigate = useNavigate();
  // console.log("FIRSTNAME", firstName)
  // state to track current active tab, default is announcements
  const [activeTab, setActiveTab] = useState('Announcements');

  // function to handle tab swtiching when button clicked
  const handleClick = (e) => {
    const currentTab = e.target.innerHTML;
    setActiveTab(currentTab);
  };
  // function to handle tab swtiching using dropdown menu
  const handleOptions = (e) => {
    console.log(e.target.value);
    setActiveTab(e.target.value);
  };
  // function to handle user logout
  const handleLogout = () => {
    onLogout(false);
  };

  // function to navigate to users management aoge
  const handleUsers = () => {
    navigate('/users');
  };


useEffect(() => {
  const getRole = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/login/role/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for session management
      });
      const data = await response.json();
      console.log('role', data);

      // upon successful login, update state
      if (response.ok) {
        if (data == 2) setUserRole('admin');
        
        // onLogin(true); // Update the login state to true
        // console.log("I AM HERE WHERE I AM WANTING TO BE!!!!!!!")
      } else {
        console.error('Login failed:', data);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };
  getRole(); 
}, [userId]);
  
  // function to see user's own name appear
  // const getFirstName = async () => {
  //   // const [users, setUsers] = useState([]);
  //     try {
  //       const response = await fetch(`http://localhost:3000/api/users`);
  //       const data = await response.json();
  //       console.log('Fetched users:', data);
  //       // setUsers(data);
  //     } catch (error) {
  //       console.log('error fetching users:', error);
  //     }
  // };
  console.log('userRole :>> ', userRole);
  return (
    <div className='dashboard'>
      <header>
        <div className='welcomeBlock'>
          <h1 className='pageTitle' id='welcome'>
            <img src={home} alt='home' className='homeIcon' /> Welcome HOAme, {firstName}!
          </h1>
        </div>
        {/* <button onClick={handleLogout}>Sign Out</button> */}
        <Logout /> {/* Use the Logout component to handle backend logout */}
      </header>

      {/* Button to swtich to announcements tabs */}
      <nav className='navigation'>
        <button className='tab' onClick={handleClick}>
          Announcements
        </button>
        {/* Dropdown menu for differnt tabs */}
        <select onChange={handleOptions} className='select'>
          <option value='Announcement'>Select Tab</option>
          <option value='Documents'>Documents</option>
          {/* <option value='MeetingMinutes'>Meeting Minutes</option> */}
          <option value='Bids'>Upload Documents</option>
        </select>
        {/* Button to directory tab */}
        <button onClick={handleClick} className='tab'>
          Directory
        </button>
        {userRole === 'admin' && (
          <button onClick={handleClick} className='tab'>
    Users
  </button>
  )}
      </nav>

      {/* Render componets based on the active tab*/}
      <div className='window'>
        {activeTab === 'Announcements' && <Announcements />}
        {activeTab === 'Documents' && <Documents />}
        {activeTab === 'Directory' && <Directory />}
        {activeTab === 'Bids' && <Bids />}
        {activeTab === 'Users'  && <Users />}
      </div>

       {/* admin only panel */}
{/*        
        <div className='admin-panel'>
          <h2>Admin Panel</h2>
          Manage Users button only accessible to admins
          <button onClick={handleUsers} className='usersManage'>
            Manage Users
          </button>
        </div> */}
    </div>
  );
};

export default Dashboard;
