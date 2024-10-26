const db = require ('../models/hoameModels.js');
const multer = require ('multer');
const path = require ('path');

// const db = require('../models/hoameModels');
// const multer = require('multer');
// const path = require('path');
const documentController = {};

/*
  Manages CRUD for documents in db
  retrive, upload, delete
*/

// function to retrieve all documents from db
documentController.getAllDocs = async (req, res, next) => {
  try {
    const getDocsString = 'SELECT * FROM files';
    const docsResult = await db.query(getDocsString);
    // if no documents return 404.  Check against rowCount property in the docsResult object returned from db.query()
    if (docsResult.rowCount === 0) {
      return next({
        log: 'Error in documentController.getAllDocs: ERROR: No documents found in DB.',
        status: 404,
        message: { err: 'No documents found.  Please upload a document' },
      });
    }

    const docs = docsResult.rows;
    res.locals.docs = docs;
    return next();
  } catch (err) {
    // using console.error vs console.log to specifically log an error object for handling errors.
    console.error('Error in documentController.getAllDocs.js: ', err);
    return next({
      log: `Error in documentController.getAllDocs ERROR:` + err,
      status: 500,
      // message users see.
      message: {
        err: 'An error occurred while retrieving documents. Please try again later.',
      },
    });
  }
};

// function to handle uploading file & saves it to database:
documentController.postUpload = async (req, res, next) => {
  try {
    //destrucure properties of req.file object provided by upload/multer() middleware in api.js route
    console.log('request hit');
    const { originalname, mimetype, size, buffer } = req.file;
    console.log(
      'documentController.postUpload - Uploaded file: ',
      originalname,
      mimetype,
      size,
      req.file.originalname
    );
    // db query content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 
      'INSERT INTO files (filename, file_size, content_type, upload_time, file_data) VALUES ($1, $2, $3, NOW(), $4)';
    // properties from multer's req.file
    const values = [originalname, size, mimetype, buffer];
    const result = await db.query(queryText, values);
    //set response (res.locals) to send back successful response
    if(result.rowCount > 0) {
      res.locals.upload = {
      message: 'File uploaded successfully',
      filename: originalname,
    };
    return next();
  } else {
    throw new Error('File not saved in the database');
  }

  } catch (err) {
    console.error(`Error in documentController.postUpload: ', ${err.message}`);
    return next({
      log: 'Error in documentController.postUpload: ' + err,
      status: 500,
      message: {
        err: 'An error occurred while uploading the document. Please try again later.',
      },
    });
  }
};

// function to delete a document from db based on IDa
documentController.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    //db query  content_type means MIME type means .pdf, .doc, .rtf, etc.
    const queryText = 'DELETE FROM files WHERE id = $1 RETURNING *;';
    const result = await db.query(queryText, [id]);

    // check if no document is found with id
    if (result.rowCount === 0) {
      next({
        log: 'Error in documentController.deleteDocument: ERROR: document not found',
        status: 404,
        message: { err: 'Document not found' },
      });
    }
    //set response (res.locals) to send back successful response
    res.locals.deletedDoc = result.rows[0];
    return next();
  } catch (err) {
    console.error('Error in documentController.deleteDocument: ', err);
    return next({
      log: 'Error in documentController.deleteDocument: ' + err,
      status: 500,
      message: {
        err: 'An error occurred while deleting the document. Please try again later.',
      },
    });
  }
};

/*
   Handles file uploads with multer to manage uploads and storage
*/

// make storage for multer to handle uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // destination folder where files will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // filename format timestamp and orignial filename for uniquness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // set a file size limit of 50 mb
  fileFilter: (req, file, cb) => {
    // allow all file types
    cb(null, true);
  },
});

// function to serve a specific file using db id
documentController.serveFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const queryText = `
      SELECT filename, content_type, file_data 
      FROM files 
      WHERE filename = $1
    `;
    const result = await db.query(queryText, [filename]);

    // check if file exists in db
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // convert binary data to base64 format for inline 
    const base64Data = file.file_data.toString('base64');
    const dataUrl = `data:${file.content_type};base64,${base64Data}`;

    // file data and type for response in res.locals
    res.locals.servedFile = {
      filename: file.filename,
      content_type: file.content_type,
      dataUrl,
    };
    
    return next();
  } catch (err) {
    console.error('Error in documentController.serveFile:', err);
    return next({
      log: 'Error in documentController.serveFile: ' + err,
      status: 500,
      message: { error: 'An error occurred while serving the file' },
    });
  }
};

// function to handle file upload expect a single file with name 'file'
documentController.uploadFile = upload.single('file');

// funtion to handle processing after file upload
documentController.handleFileUpload = (req, res, next) => {
  try {
    // check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // send response info on uploaded file
    res.status(201).json({
      message: 'File uploaded successfully',
      file: req.file, // file metadata
    });
  } catch (err) {
    next({
      log: `Error in uploadController.handleFileUpload: ${err}`,
      status: 500,
      message: {
        err: 'An error occurred while uploading the file. Please try again later.',
      },
    });
  }
};

module.exports = documentController;
