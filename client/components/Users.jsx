import React, { useState, useEffect } from 'react';


/*
   Allows admin to view existing users and add new users
*/

const Users = () => {
  const [users, setUsers] = useState([]); // state to store fetched users
  const [newUser, setNewUser] = useState({ username: '', role: '' }); // state for new user, storing username and role
  const [error, setError] = useState(''); // state for errors
  const [successMessage, setSuccessMessage] = useState(''); // state to display success messages

  // fetch users from server when loaded
  useEffect(() => {
    fetchUsers();
  }, []);

  // fetches users from server
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      const data = await response.json();
      console.log('fetched user data', data);
      const userArray = Array.isArray(data) ? data : data.users || data.data || [];
      setUsers(userArray); // update state with fetch data
      console.log(' processed fetched user data', userArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    }
  };

  // function to update state with values for username and role
  const inputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  // function to add user role
  // const fetchUserRole = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:3000/login/role/${id}', {
  //     });
      
  //     if (response.ok) {
  //       alert('User add successfully');
  //       setNewUser({ username: '', role: '' }); //reset input fields
  //       fetchUsers(); // refresh user list
  //     } else {
  //       setError('Failed to add user. Please check the details and try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error adding user:', error);
  //     setError('An error occurred while adding the user.');
  //   }
  // };
  
  // function to delete user
  const deleteUser = async (id) => {
    console.log(`users id delete' ${id}`);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('user response', response);
      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers(); // refresh users list
      } else {
        const errorMessage = await response.text();
        console.error('failed to delete user', errorMessage);
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error in deleting user');
    }
  };
  
  // function to upgrade a user's role to admin
  const upgradeToAdmin = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}/upgrade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        fetchUsers(); // refresh users list
        alert('User upgraded to admin successfully');
      } else {
        alert('Failed to upgrade user role');
      }
    } catch (error) {
      console.error('Error upgrading user role:', error);
    }
  };

  const demoteToMember = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}/downgrade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        fetchUsers(); // refresh users list
        alert('User demoted to member successfully');
      } else {
        alert('Failed to upgrade user role');
      }
    } catch (error) {
      console.error('Error upgrading user role:', error);
    }
  };
  
  
  console.log('users :>> ', users);
  return (
    <div className="users">
      <h1>Users</h1>

      {/* display error messages */}
      {error && <p className="error">{error}</p>}

      {/* form to add a new user */}
      {/* <form onSubmit={addUser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={inputChange}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select
            name="role"
            value={newUser.role}
            onChange={inputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form> */}

      {/* list of current users */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
             First Name: {user.first_name} < br />
             Last Name: {user.last_name} < br />
             Username: {user.username} < br />
             Address: {user.street_address} < br />
             Phone: {user.phone} < br />
             Role: {
  (() => {
    if (user.role_id == 1) return 'Owner';
    else if (user.role_id == 2) return 'Admin';
    else return 'Member';
  })()
} <br />
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            {user.role_id != 2 && (
              <button onClick={() => upgradeToAdmin(user.id)}>Upgrade to Admin</button>
            )}
            {user.role_id == 2 && (
              <button onClick={() => demoteToMember(user.id)}>Demote to Member</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;