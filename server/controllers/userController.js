const db = require('../models/hoameModels.js');
const roleController = require('../controllers/roleController');

/*
  Manages user operations with fetch, user signup, user login
*/

const userController = {};

// function to get all users in db
userController.getAllUsers = async (req, res, next) => {
  try {
    const getUsersString = `
      SELECT users.*, user_roles.role_id FROM users LEFT JOIN user_roles ON users.id = user_roles.users_id
    `;
    const usersResult = await db.query(getUsersString);

    const users = usersResult.rows;
    res.locals.users = users;
    next();
  } catch (err) {
    console.log(err);
    next({
      log: 'getAllUsers',
      message: {
        err: 'userController.getAllUsers ERROR: Check server logs for details',
      },
    });
  }
};

// function to signup/ add new user
userController.signup = async (req, res, next) => {
  let { first_name, last_name, street_address, phone, username, password } =
    req.body;

  //Filters aspects inside of username and phone to make it easier for different kinds of inputs
  phone = phone.replaceAll('-', '');
  username = username.toLowerCase();

  try {
    const signupString =
      'INSERT into users (first_name, last_name, street_address, phone, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const newUser = await db.query(signupString, [
      first_name,
      last_name,
      street_address,
      phone,
      username,
      password,
    ]);

    // Check if newUser.rows is populated
    if (!newUser.rows.length) {
      return next({
        log: 'signup',
        message: { err: 'User signup failed, no user returned.' },
      });
    }

    res.locals.account = newUser.rows;
    // Debugging log to check if account is populated
    //console.log('Signup successful, res.locals.account:', res.locals.account);
    return next();
  } catch (err) {
    console.log(err);
    next({
      log: 'signup',
      message: {
        err: 'userController.signup ERROR: Check server logs for details',
      },
    });
  }
};

// function to authenicate user and start session
userController.login = async (req, res, next) => {
  let { username, password, google_id, oauth_provider, first_name, last_name } = req.body;

  try {
    // console.log("REQBODY IN USERCONTROLLER LOGIN", req.body)
    const loginString =  'SELECT id, username, first_name, password, google_id FROM users WHERE username = $1 OR google_id = $2';
    // store as lowercase for ease
    const userResult = await db.query(loginString, [username.toLowerCase(), google_id]);
    const user = userResult.rows[0]
    
    console.log("USERCONTROLLERLOGIN- user", user)

   
   
    //if logging in with Oauth for first time - not yet a registered user and need to add to database
    if (!user) {
      const newUser = await db.query(
        'INSERT INTO users (username, google_id, oauth_provider, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, google_id, oauth_provider, first_name, last_name]
      );
      const createdUser = newUser.rows[0];

      req.session.user = {
        id: createdUser.id,
        username:createdUser.username,
        roles: []
      }

      res.locals.login = true;
      res.locals.account = [{...createdUser}]
      console.log('New User Created (userController.login)', createdUser)
      return next()
    }

    //If you already logged in using OAuth previously - your information is in the database and and proceed to login
    //The request body will not contain a password and only contain a google ID
    if (!user.password && google_id === user.google_id) {
      res.locals.login = true;
      res.locals.account =[{...user}]
      return next()
    }


    //logging into platform without Oauth
    // compare password to hashed password in db
    if (password && user.password === password) {
      res.locals.login = true;
      res.locals.account =[{...user}]
      console.log('Login successful', user)
      console.log("RESLOCALSACCOUNT", res.locals.account[0].first_name)
    } else {
      res.locals.login = false;
      console.log('Login not successful, try again')
    }
    return next();
  }  catch (err) {
    // Using console.error vs console.log to specifically log an error object for handling errors.
    console.error('Error in userController.login.js: ', err);
    return next({
      log: `Error in userController.login ERROR:` + err,
      status: 500, // Internal server error
      // Message users see.
      message: {
        err: 'An error occurred logging in. Please try again later.',
      },
    });
  }
}

// function to add new user to db
// userController.addUser = async (req, res, next) => {
//   const { username, role, first_name, last_name, password } = req.body;

//   // check fields
//   if (!username || !role) {
//     return res.status(400).json({ message: 'Username and role are required' });
//   }
//   // query 
//   try {
//     const queryText = `
//       INSERT INTO users (username, role, first_name, last_name, password) 
//       VALUES ($1, $2, $3, $4, $5) 
//     `;
//     const values = [username, role, first_name, last_name, password];
//     const result = await db.query(queryText, values);

//     // save new user to res.locals
//     res.locals.newUser = result.rows[0];
//     return next();
//   } catch (err) {
//     return next({
//       log: 'Error in userController.addUser',
//       message: { err: 'Error occurred while adding a new user' },
//     });
//   }
// };

// function to delete new user from db
userController.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    //db query  content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await db.query(queryText, [id]);
    console.log(`delete user with id: ${id}`);

    // check if no document is found with id
    if (result.rowCount === 0) {
      next({
        log: 'Error in userController.deleteUser: ERROR: User not found',
        status: 404,
        message: { err: 'Document not found' },
      });
    }
    //set response (res.locals) to send back successful response
    return res.status(200).json({
      message: 'User deleted sucessful',
      deletedUser: result.rows[0],
    })
    //res.locals.deletedUser = result.rows[0];
    return next();
  } catch (err) {
    console.error('Error in userController.deleteUser: ', err);
    return next({
      log: 'Error in userController.deleteUser: ' + err,
      status: 500,
      message: 'An error occurred while deleting the document. Please try again later.',
        err: err.message,
    });
  }
};

userController.upgradeUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }
    //db query  content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 'UPDATE user_roles SET role_id = 2 WHERE users_id = $1';
    const result = await db.query(queryText, [id]);

    // check if no document is found with id
    if (result.rowCount === 0) {
      const addText = 'INSERT INTO user_roles (role_id, users_id) VALUES ($1, $2)';
      const insertResult = await db.query(addText, [2, id]); // Assuming role_id is 2
    }
    //set response (res.locals) to send back successful response
    return next();
  } catch (err) {
    console.error('Error in userController.upgradeUser: ', err);
    return next({
      log: 'Error in userController.upgradeUser: ' + err,
      status: 500,
      message: {
        err: 'An error occurred while deleting the document. Please try again later.',
      },
    });
  }
};

userController.downgradeUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }
    //db query  content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 'UPDATE user_roles SET role_id = 3 WHERE users_id = $1';
    const result = await db.query(queryText, [id]);

    // check if no document is found with id
    if (result.rowCount === 0) {
      const addText = 'INSERT INTO user_roles (role_id, users_id) VALUES ($1, $2)';
      const insertResult = await db.query(addText, [3, id]); // Assuming role_id is 2
    }
    //set response (res.locals) to send back successful response
    return next();
  } catch (err) {
    console.error('Error in userController.downgradeUser: ', err);
    return next({
      log: 'Error in userController.downgradeUser: ' + err,
      status: 500,
      message: {
        err: 'An error occurred while deleting the document. Please try again later.',
      },
    });
  }
};

userController.getRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    //db query  content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 'SELECT role_id FROM user_roles WHERE users_id = $1';
    const result = await db.query(queryText, [id]);
    
    // check if no document is found with id
    if (result.rowCount === 0) {
      next({
        log: 'Error in userController.getRole: ERROR: User not found',
        status: 404,
        message: { err: 'Document not found' },
      });
    }
    //set response (res.locals) to send back successful response
    res.locals.userRoleId = result.rows[0];
    return next();
  } catch (err) {
    console.error('Error in userController.getRole: ', err);
    return next({
      log: 'Error in userController.getRole: ' + err,
      status: 500,
      message: {
        err: 'An error occurred getting role. Please try again later.',
      },
    });
  }
};

module.exports = userController;
