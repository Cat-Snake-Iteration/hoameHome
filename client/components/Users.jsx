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
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data); // update state with fetch data
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    }
  };

  // functions form input changes for adding a new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // submits new user data to server
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User add successfully');
        setNewUser({ username: '', role: '' }); //reset input fields
        fetchUsers(); // refresh user list
      } else {
        setError('Failed to add user. Please check the details and try again.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('An error occurred while adding the user.');
    }
  };

  return (
    <div className="users">
      <h1>Users</h1>

      {/* display error messages */}
      {error && <p className="error">{error}</p>}

      {/* form to add a new user */}
      <form onSubmit={handleAddUser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>

      {/* list of existing users */}
      <h2>Existing Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;