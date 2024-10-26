const db = require('../models/hoameModels.js');

const sessionController = {};

/*
  Manages sessions by creating, authenication, ending
*/

// function to create session with 1 hr limit
sessionController.startSession = async (req, res, next) => {
  console.log('Session started');
  try {
    // check if user exists in res.locals
    if (!res.locals.account || !res.locals.account[0]) {
      return next({
        log: 'startSession',
        message: { err: 'User account is missing in res.locals.' },
      });
    }
    const { id } = res.locals.account[0]; // get id from user in database
    // check that user has id
    if (!id) {
      return next({
        log: 'startSession',
        message: { err: 'User ID is missing from account' },
      });
    }
    console.log(
      'Extracting id from res locals account',
      res.locals.account[0],
      id
    );

    // find session expiration for 1 hr
    const createdAT = new Date();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    // query to insert new session into sessions table
    const newSessionString =
      'INSERT into sessions (user_id, created_time, expires_time) VALUES ($1, $2, $3) RETURNING *';
    const session = await db.query(newSessionString, [
      id,
      createdAT,
      expirationTime,
    ]);
    console.log('SESSION CREATED', session.rows);

    res.locals.session = session.rows[0];
    return next();
  } catch (err) {
    // if error then pass to global error
    return next({
      log: `Error in sessionController.startSession: ${err}`,
      status: 500,
      message: { err: 'An error occurred while creating the session.' },
    });
  }
};

// function to ensure user is authenicated before access
sessionController.isAuthenticated = async (req, res, next) => {
  console.log('Checking authentication...');

  try {
    // get session id from cookies and check for no ssid in cookies
    const { hoame_ssid } = req.cookies;
    console.log('SSID from cookies:', hoame_ssid); // Log the cookie to verify it's being sent

    // check for ssid
    if (!hoame_ssid)
      return res.status(401).json({
        message: 'BEGONE, YOUR ACCESS HAS BEEN DENIED. NO ACTIVE SESSION FOUND',
      });

    // check session exist and if not expired
    const query = 'SELECT * FROM sessions WHERE id = $1';
    const result = await db.query(query, [hoame_ssid]); // do query
    if (result.rowCount === 0)
      return res.status(401).json({
        message: 'BEGONE, YOUR ACCESS HAS BEEN DENIED. NO SESSION FOUND',
      });

    const currentTime = new Date(); // get current time
    const session = result.rows[0]; // get session details such as expires_time

    // check for session expiration
    if (currentTime > session.expires_time)
      return res.status(401).json({
        message: 'BEGONE, YOUR ACCESS HAS BEEN DENIED. SESSION EXPIRED',
      });

    console.log('authenticated');
    return next();
  } catch (error) {
    return next({
      log: `Error in sessionController.isAuthenticated: ${error}`,
      status: 500,
      message: { err: 'An error occurred while verifying the session.' },
    });
  }
};

// function to handle logout
sessionController.endSession = async (req, res, next) => {
  console.log('ending session...');
  try {
    const { hoame_ssid } = req.cookies; // ssid is stored in cookies

    // query to delete session based on user_id
    const deleteSession = 'DELETE FROM sessions WHERE id = $1';
    await db.query(deleteSession, [hoame_ssid]);

    //clear cookie
    res.clearCookie('hoame_ssid', { sameSite: 'None', secure: false });
    res.clearCookie('SSID', { domain: '.google.com', path: '/' });
    console.log('session deleted and cookie cleared');
    return next();
  } catch (error) {
    return next({
      log: `Error in sessionController.endSession : ${error}`,
      status: 500,
      message: { err: 'An error occurred while ending the session.' },
    });
  }
};
module.exports = sessionController;
