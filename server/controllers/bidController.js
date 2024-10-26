// const db = require('../models/hoameModels.js');
// const multer = require('multer');
// const path = require('path');

// /*
//    Handles file uploads with multer to manage uploads and storage
// */

// // make storage for multer to handle uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // destination folder where files will be stored
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // filename format timestamp and orignial filename for uniquness
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// // initialize multer upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 50 }, // set a file size limit of 50 mb
//   fileFilter: (req, file, cb) => {
//     // allow all file types
//     cb(null, true);
//   },
// });

// const bidController = {};

// // function to handle file upload expect a single file with name 'file'
// bidController.uploadFile = upload.single('file');

// // funtion to handle processing after file upload
// bidControllerr.handleFileUpload = (req, res, next) => {
//   try {
//     // check if a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     // send response info on uploaded file
//     res.status(201).json({
//       message: 'File uploaded successfully',
//       file: req.file, // file metadata
//     });
//   } catch (err) {
//     next({
//       log: `Error in uploadController.handleFileUpload: ${err}`,
//       status: 500,
//       message: {
//         err: 'An error occurred while uploading the file. Please try again later.',
//       },
//     });
//   }
// };

// module.exports = uploadController;
