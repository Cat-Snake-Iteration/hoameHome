const cookieController = {};

/*
 * Manages setting cookies and SSID and makes sure they expire in 1 hr
 */

// function to set session cookie to track user
cookieController.setCookie = (req, res, next) => {
  // check if session and session ID exist in res.locals
  if (!res.locals.session || !res.locals.session.id) {
    console.error('Session ID missing from res.locals');
    return next({
      log: 'Error: Session ID missing in cookieController.setCookie',
      status: 500,
      message: { err: 'An error occurred while setting the session cookie.' },
    });
  }

  // set 'ssid' as our primary session identifier
  console.log('Setting Cookie for session ID:', res.locals.session.id);
  
  res.cookie('hoame_ssid', res.locals.session.id, {
    httpOnly: true,
    secure: false,
    // set secure to true if using HTTPS
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  console.log('Cookie set successfully: ', res.locals.session.id);
  return next();
};

// funciton to set an SSID to track user through account id
cookieController.setSSIDCookie = (req, res, next) => {
  console.log('setting SSIDcookie');
  // check res.locals.account exists and is set
  if (res.locals.account && res.locals.account[0] && res.locals.account[0].id) {
    const userId = res.locals.account[0].id.toString();
    console.log('Setting SSID cookie for userId:', userId);

    // SSID cookie
    res.cookie('hoame_ssid', userId, {
      httpOnly: true,
      secure: false, // Use only over HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    console.log("ssidCookie", userId)
    return next();
  } else {
    // handle error case if no account found
    console.error('Error: User account is missing in res.locals.');
    return next({
      log: 'cookieController.setSSIDCookie',
      message: { err: 'User ID is missing from res.locals.account' },
    });
  }
};

module.exports = cookieController;

// // --> Stretch - if time allows --->  Set SSID (Session ID) Cookie
// cookieController.setSSIDCookie = (req, res, next) => {
//   //find id
//   const id = res.locals.users.id;
//   // console.log('id:', id);
//   if (id) {
//     // console.log('id exists:', id);
//     res.cookie('ssid', id.toString(), {
//       httpOnly: true,
//       secure: true,
//     });

//     return next();
//   } else {
//     const err = new Error('failed to get ssid')
//     return next('Error in cookieController.setSSIDCookie: ' + JSON.stringify(err));
//   }
// };
