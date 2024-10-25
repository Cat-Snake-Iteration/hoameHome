const express = require('express');
const userController = require('../controllers/userController');
const documentController = require('../controllers/documentController');
const announcementController = require('../controllers/announcementController');
const cookieController = require('../controllers/cookieController.js');
const sessionController = require('../controllers/sessionController.js');
//const roleController = require("./server/controllers/roleController");
const roleController = require('../controllers/roleController');

//require multer for /upload endpoint
const multer = require('multer');
const upload = multer();

const router = express.Router();

// route to get all users
router.get('/users', userController.getAllUsers, (req, res) => {
  res.status(200).json(res.locals.users);
});

// route to create user
router.post(
  '/signup',
  userController.signup,
  sessionController.startSession, //start a session an post to the database
  cookieController.setCookie,
  (req, res) => {
    res.status(201).json(res.locals.account);
  }
);
// route to login
router.post(
  '/login',
  userController.login,
  sessionController.startSession, // start session after good login
  cookieController.setCookie, // set cookie after session creation
  (req, res) => {
    // console.log('RESLOCALSFIRSTNAME', res.locals.firstName); //- currently undefined
    res
      .status(200)
      .json({ login: res.locals.login, firstName: res.locals.account[0].first_name});
  }
);

// route to check if user is authenticated
router.get('/auth/check', sessionController.isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'User is authenticated.' });
});
// route to logout(end session)
router.post(
  '/logout',
  sessionController.isAuthenticated,
  sessionController.endSession,
  (req, res) => {
    res.clearCookie('ssid');
    res.status(200).json({ message: 'Logged out successful' });
  }
);
// route to get all announcements
router.get(
  '/announcements',
  announcementController.getAllAnnouncements,
  (req, res) => {
    res.status(200).json(res.locals.announcements);
  }
);
// route to create announcement
router.post(
  '/announcements',
  sessionController.isAuthenticated,
  // Only 'admin' and 'owner' can create
  roleController.checkPermissions(['admin']),
  // roleController.checkPermissions(["admin"]),
  announcementController.createAnnouncements,
  (req, res) => {
    res.status(201).json(res.locals.announcements);
  }
);

// route to delete announcement
router.delete(
  '/announcements/:id',
  sessionController.isAuthenticated,
  // Only 'admin' can delete
  roleController.checkPermissions(['admin']),
  announcementController.deleteAnnouncement,
  (req, res) => {
    // console.log('Made it to response in api.js', res.locals.announcements )
    res.status(200).json(res.locals.deletedAnnouncement);
  }
);

/**
 * documentController routes
 * upload endpoint for calling multer upload.single('file') <-- argument must match name attribute set in HTML form that submits the file <--, followed by documentControllerUpload middleware to upload files to Db & then send a response back.
 */
router.post(
  '/upload',
  upload.single('file'),
  documentController.postUpload,
  (req, res) => {
    console.log('from api.js - File uploaded and saved to database.');
    res.status(201).json(res.locals.upload);
  }
);

// Route to get documents from DB
router.get('/getDocs', documentController.getAllDocs, (req, res) => {
  //console.log('Hello from /viewDocs route in api.js"');
  return res.status(200).json(res.locals.docs);
});

//delete a document from the database
router.delete(
  '/deleteDoc/:id',
  documentController.deleteDocument,
  (req, res) => {
    return res.status(200).json(res.locals.deletedDoc);
  }
);

// route for file upload.   --- Not in use
// router.post(
//   '/upload',
//   bidControllerr.uploadFile,
//   bidControllerr.handleFileUpload
// );
module.exports = router;

// // -- Stretch --  Create secure session id before starting session
// router.post(
//   '/signup',
//   userController.signup,
//   cookieController.setSSIDCookie,  //Set secure session ID cookie
//   sessionController.startSession, //start a session and post to the database
//   (req, res) => {
//     res.status(201).json(res.locals.account);
//   }
// );

// Commenting out for now, using announcementController.createAnnouncements instead.
// router.post('/announcements',
//   announcementController.postAnnouncement,
//   announcementController.getAllAnnouncements,
//   (req, res) =>{
//   // console.log('Made it to response in api.js', res.locals.announcements )
//  res.status(201).json(res.locals.announcements);
// })
